import type { GridDesign, PartItem } from "@/types";
import {
  LUMBER_SPECS,
  SHELF_BOARDS,
  BRACKETS,
  buildAmazonUrl,
  ACCESSORY_MAP,
  BRACKET_MAP,
} from "@/data/products";
import { optimizeMixedCutPlan, formatBarsByLength, type CutPieceGroup, type StockCandidate } from "./cut-optimizer";
import { STANDARD_LENGTHS, CUT_FEE_PER_CUT, KERF_WIDTH_MM } from "@/constants/woodCutCalculator";

// resolveAdj は src/lib/resolvers.ts に統合済み
import { resolveAdjuster as resolveAdj } from "./resolvers";

const STOCK_LENGTH_LABELS: Record<number, string> = Object.fromEntries(
  STANDARD_LENGTHS.map((s) => [s.value, s.label]),
);

/** 定尺材の候補長さそれぞれについて、価格倍率を加味した1本あたり価格を返す */
function stockCandidatesFor(pricePerUnit: number): StockCandidate[] {
  return STANDARD_LENGTHS.map((s) => ({
    lengthMm: s.value,
    barPriceYen: Math.round(pricePerUnit * s.priceMult),
  }));
}

/**
 * 複数の定尺材長さを組み合わせて最適化する。
 * (長い部材には長いバー、短い部材には安いバー、というように混在させられる)
 */
function optimizeWithStandardLengths(groups: CutPieceGroup[], pricePerUnit: number) {
  const plan = optimizeMixedCutPlan(groups, stockCandidatesFor(pricePerUnit), {
    kerfMm: KERF_WIDTH_MM,
    cutFeePerCut: CUT_FEE_PER_CUT,
  });
  return plan.barsNeeded > 0 ? plan : null;
}

/**
 * グリッドデザインから部材リストを生成
 */
export function calculateGridParts(design: GridDesign): {
  partsList: PartItem[];
  totalEstimate: number;
} {
  if (!design || !design.pillars || !design.shelves) {
    return { partsList: [], totalEstimate: 0 };
  }
  const ceilingHeight = Number(design.ceilingHeight) || 2400;

  const parts: PartItem[] = [];
  const pMap = new Map(design.pillars.map((p) => [p.id, p]));

  // ── アジャスター (brand+lumber でグルーピング) ──
  const adjGroups = new Map<
    string,
    { name: string; count: number; price: number; kw: string; offset: number }
  >();
  for (const p of design.pillars) {
    if (!p.adjuster) continue;
    const a = resolveAdj(p.adjuster, p.lumber);
    const k = `${p.adjuster}-${p.lumber}`;
    const g = adjGroups.get(k);
    if (g) g.count++;
    else
      adjGroups.set(k, {
        name: a.name,
        count: 1,
        price: a.priceYen,
        kw: a.amazonKeyword,
        offset: a.cutOffset,
      });
  }
  for (const [, g] of adjGroups) {
    parts.push({
      category: "adjuster",
      name: g.name,
      quantity: g.count,
      unitPrice: g.price,
      subtotal: g.price * g.count,
      amazonUrl: buildAmazonUrl(g.kw),
      note: `天井高から−${g.offset}mmでカット`,
    });
  }

  // ── 柱用木材・棚板用木材(2×4/1×4材)をまとめて最適化 ──
  // 柱と、同じ木材から作る棚板(2x4-shelf/1x4-shelf)は物理的に同じ定尺材から
  // 切り出せるため、材質(underlying lumber key)が一致する場合は1本の
  // 定尺材購入計画にまとめる。材質が違う場合(例: 柱2×4材＋棚板1×4材)は
  // 従来通り別々に最適化する。
  const combinedLumberGroups = new Map<
    string,
    { spec: (typeof LUMBER_SPECS)["2x4"]; cutGroups: CutPieceGroup[] }
  >();
  function addLumberPieces(materialKey: string, spec: (typeof LUMBER_SPECS)["2x4"], entries: CutPieceGroup[]) {
    let g = combinedLumberGroups.get(materialKey);
    if (!g) {
      g = { spec, cutGroups: [] };
      combinedLumberGroups.set(materialKey, g);
    }
    g.cutGroups.push(...entries);
  }

  // 柱
  const pillarCutTally = new Map<string, Map<number, number>>();
  for (const p of design.pillars) {
    const adj = p.adjuster ? resolveAdj(p.adjuster, p.lumber) : null;
    const cut = adj
      ? Math.max(0, ceilingHeight - adj.cutOffset)
      : ceilingHeight;
    let tally = pillarCutTally.get(p.lumber);
    if (!tally) {
      tally = new Map();
      pillarCutTally.set(p.lumber, tally);
    }
    tally.set(cut, (tally.get(cut) ?? 0) + 1);
  }
  for (const [lumberKey, tally] of pillarCutTally) {
    const spec = LUMBER_SPECS[lumberKey] ?? LUMBER_SPECS["2x4"];
    addLumberPieces(
      lumberKey,
      spec,
      [...tally.entries()].map(([lengthMm, quantity]) => ({ lengthMm, quantity, label: "柱" })),
    );
  }

  // ── 棚板 (material+depth でグルーピング) ──
  const shelfGroups = new Map<
    string,
    {
      board: (typeof SHELF_BOARDS)[0];
      count: number;
      widths: number[];
      depth: number;
    }
  >();
  for (const s of design.shelves) {
    const lp = pMap.get(s.leftPillarId);
    const rp = pMap.get(s.rightPillarId);
    if (!lp || !rp) continue;
    const w = Math.abs(rp.x - lp.x);
    const board = SHELF_BOARDS.find((b) => b.id === s.material) ?? SHELF_BOARDS[0];
    const depth = board.fixedDepthMm > 0 ? board.fixedDepthMm : s.depth;
    const k = `${s.material}-${depth}`;
    const g = shelfGroups.get(k);
    if (g) {
      g.count++;
      g.widths.push(w);
    } else {
      shelfGroups.set(k, { board, count: 1, widths: [w], depth });
    }
  }
  const shelfBoardNoteByMaterial = new Map<string, string>();
  for (const [, g] of shelfGroups) {
    if (g.board.id === "2x4-shelf" || g.board.id === "1x4-shelf") {
      const lumberKey = g.board.id === "2x4-shelf" ? "2x4" : "1x4";
      const spec = LUMBER_SPECS[lumberKey];
      const bw = spec?.widthMm ?? 89;
      const perShelf = Math.max(1, Math.ceil(g.depth / bw));

      // 各棚(幅がバラバラ)からperShelf本ずつ、定尺材から切り出す必要がある
      const widthTally = new Map<number, number>();
      for (const w of g.widths) {
        widthTally.set(w, (widthTally.get(w) ?? 0) + perShelf);
      }
      addLumberPieces(
        lumberKey,
        spec,
        [...widthTally.entries()].map(([lengthMm, quantity]) => ({ lengthMm, quantity, label: "棚板" })),
      );
      shelfBoardNoteByMaterial.set(lumberKey, `棚板${g.count}枚 × ${perShelf}本並べ`);
    } else {
      let sub = 0;
      for (const w of g.widths) {
        sub += Math.round(g.board.pricePerUnit * (w / 600) * (g.depth / 250));
      }
      sub = Math.max(0, sub);
      const avg = g.count > 0 ? Math.round(sub / g.count) : 0;
      parts.push({
        category: "shelf",
        name: `${g.board.name}【棚板用】`,
        quantity: g.count,
        unitPrice: avg,
        subtotal: sub,
        amazonUrl: buildAmazonUrl(g.board.amazonKeyword),
        note: `奥行${g.depth}mm × 厚さ${g.board.thicknessMm}mm`,
      });
    }
  }

  // ── 統合した柱用・棚板用木材を最適化して部材リストに追加 ──
  for (const [lumberKey, g] of combinedLumberGroups) {
    if (g.cutGroups.length === 0) continue;
    const plan = optimizeWithStandardLengths(g.cutGroups, g.spec.pricePerUnit);
    if (!plan) continue;

    const lengthSummary = formatBarsByLength(plan, STOCK_LENGTH_LABELS);
    const pillarQty = pillarCutTally.get(lumberKey);
    const pillarNote = pillarQty
      ? `柱${[...pillarQty.values()].reduce((a, b) => a + b, 0)}本`
      : null;
    const shelfNote = shelfBoardNoteByMaterial.get(lumberKey) ?? null;
    const usageNote = [pillarNote, shelfNote].filter(Boolean).join("＋");
    const suffix = pillarNote && shelfNote ? "【柱・棚板共用】" : pillarNote ? "【柱用】" : "【棚板用】";

    // 最長の定尺材(12ft)にも収まらない部材がある場合、静かに購入計画から
    // 消してはいけないため、警告として明示する(特注・継ぎ足しが必要になる)
    const unfitWarning =
      plan.unfitPieces.length > 0
        ? `⚠️ ${plan.unfitPieces.map((p) => `${p.lengthMm}mm(${p.label ?? "部材"})`).join("・")}は最長の定尺材にも収まりません。特注または継ぎ足しをご検討ください。`
        : "";

    parts.push({
      category: "lumber",
      name: `${g.spec.name}${suffix}`,
      quantity: plan.barsNeeded,
      unitPrice: Math.round(plan.totalCost / plan.barsNeeded),
      subtotal: plan.totalCost,
      amazonUrl: buildAmazonUrl(g.spec.amazonKeyword),
      note: `${lengthSummary}／${usageNote}をまとめてカット（カット${plan.totalCutCount}回・端材計${plan.totalWasteMm}mm）${unfitWarning}`,
      cutPlan: plan,
    });
  }

  // ── 棚受け金具 + ネジ ──
  if (design.shelves.length > 0) {
    // 棚受けをID別にグルーピング
    const bracketGroups = new Map<string, { bracket: (typeof BRACKETS)[0]; count: number }>();
    for (const s of design.shelves) {
      const bid = s.bracketId ?? design.defaultBracketId;
      const bracket = BRACKET_MAP.get(bid) ?? BRACKETS[0];
      const g = bracketGroups.get(bracket.id);
      if (g) g.count++;
      else bracketGroups.set(bracket.id, { bracket, count: 1 });
    }
    for (const [, g] of bracketGroups) {
      parts.push({
        category: "bracket",
        name: g.bracket.name,
        quantity: g.count,
        unitPrice: g.bracket.pricePerPair,
        subtotal: g.bracket.pricePerPair * g.count,
        amazonUrl: buildAmazonUrl(g.bracket.amazonKeyword),
        note: `棚板${g.count}枚分`,
      });
    }

    const screws = Math.ceil(design.shelves.length * 4 * 1.2);
    parts.push({
      category: "screw",
      name: "木ネジセット (3.8×32mm)",
      quantity: 1,
      unitPrice: 400,
      subtotal: 400,
      amazonUrl: buildAmazonUrl("木ネジ 3.8×32 ステンレス"),
      note: `約${screws}本使用`,
    });
  }

  // ── 装飾品 ──
  if (design.accessories && design.accessories.length > 0) {
    const accGroups = new Map<string, { product: NonNullable<ReturnType<typeof ACCESSORY_MAP.get>>; count: number }>();
    for (const acc of design.accessories) {
      const product = ACCESSORY_MAP.get(acc.productId);
      if (!product) continue;
      const g = accGroups.get(product.id);
      if (g) g.count++;
      else accGroups.set(product.id, { product, count: 1 });
    }
    for (const [, g] of accGroups) {
      parts.push({
        category: "accessory",
        name: `${g.product.icon} ${g.product.name}`,
        quantity: g.count,
        unitPrice: g.product.priceYen,
        subtotal: g.product.priceYen * g.count,
        amazonUrl: buildAmazonUrl(g.product.amazonKeyword),
      });
    }
  }

  const totalEstimate = parts.reduce((s, p) => s + p.subtotal, 0);
  return { partsList: parts, totalEstimate };
}

import type { GridDesign, PartItem } from "@/types";
import {
  LUMBER_SPECS,
  SHELF_BOARDS,
  BRACKETS,
  buildAmazonUrl,
  ACCESSORY_MAP,
  BRACKET_MAP,
} from "@/data/products";
import { optimizeCutPlan, type CutPieceGroup } from "./cut-optimizer";
import { STANDARD_LENGTHS, CUT_FEE_PER_CUT, KERF_WIDTH_MM } from "@/constants/woodCutCalculator";

// resolveAdj は src/lib/resolvers.ts に統合済み
import { resolveAdjuster as resolveAdj } from "./resolvers";

/** 定尺材の候補長さそれぞれについて、価格倍率を加味した1本あたり価格を返す */
function barPricesForCandidates(pricePerUnit: number): { lengthMm: number; barPriceYen: number }[] {
  return STANDARD_LENGTHS.map((s) => ({
    lengthMm: s.value,
    barPriceYen: Math.round(pricePerUnit * s.priceMult),
  }));
}

/**
 * 複数の定尺材長さ候補それぞれで最適化を試し、総コストが最小の結果を返す。
 * (定尺材ごとに単価が異なるため、cut-optimizer側のoptimizeCutPlanAcrossLengthsを
 *  そのまま使わず、候補ごとにbarPriceYenを差し替えて呼び出す)
 */
function optimizeAcrossPricedLengths(groups: CutPieceGroup[], pricePerUnit: number) {
  const candidates = barPricesForCandidates(pricePerUnit);
  const plans = candidates
    .map((c) =>
      optimizeCutPlan(groups, c.lengthMm, {
        kerfMm: KERF_WIDTH_MM,
        cutFeePerCut: CUT_FEE_PER_CUT,
        barPriceYen: c.barPriceYen,
      }),
    )
    .filter((p) => p.barsNeeded > 0);
  if (plans.length === 0) return null;
  return plans.reduce((best, p) => (p.totalCost < best.totalCost ? p : best));
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

  // ── 柱用木材 (材質ごとにグルーピングし、必要な長さをまとめて定尺材から
  //    最適に切り出す購入本数を算出する) ──
  const pillarLumberGroups = new Map<
    string,
    { spec: (typeof LUMBER_SPECS)["2x4"]; cutLens: Map<number, number> }
  >();
  for (const p of design.pillars) {
    const spec = LUMBER_SPECS[p.lumber] ?? LUMBER_SPECS["2x4"];
    const adj = p.adjuster ? resolveAdj(p.adjuster, p.lumber) : null;
    const cut = adj
      ? Math.max(0, ceilingHeight - adj.cutOffset)
      : ceilingHeight;
    let g = pillarLumberGroups.get(p.lumber);
    if (!g) {
      g = { spec, cutLens: new Map() };
      pillarLumberGroups.set(p.lumber, g);
    }
    g.cutLens.set(cut, (g.cutLens.get(cut) ?? 0) + 1);
  }
  for (const [, g] of pillarLumberGroups) {
    const cutGroups: CutPieceGroup[] = [...g.cutLens.entries()].map(([lengthMm, quantity]) => ({
      lengthMm,
      quantity,
    }));
    const plan = optimizeAcrossPricedLengths(cutGroups, g.spec.pricePerUnit);
    if (!plan) continue;
    const stdLabel = STANDARD_LENGTHS.find((s) => s.value === plan.barLengthMm)?.label ?? `${plan.barLengthMm}mm`;
    const lengthsNote = [...g.cutLens.entries()]
      .map(([len, qty]) => `${len}mm×${qty}本`)
      .join("、");
    parts.push({
      category: "lumber",
      name: `${g.spec.name} ${stdLabel}【柱用】`,
      quantity: plan.barsNeeded,
      unitPrice: Math.round(plan.totalCost / plan.barsNeeded),
      subtotal: plan.totalCost,
      amazonUrl: buildAmazonUrl(g.spec.amazonKeyword),
      note: `${lengthsNote}を切り出し（カット${plan.totalCutCount}回・端材計${plan.totalWasteMm}mm）`,
      cutPlan: plan,
    });
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
  for (const [, g] of shelfGroups) {
    if (g.board.id === "2x4-shelf" || g.board.id === "1x4-shelf") {
      const bw =
        LUMBER_SPECS[g.board.id === "2x4-shelf" ? "2x4" : "1x4"]?.widthMm ??
        89;
      const perShelf = Math.max(1, Math.ceil(g.depth / bw));

      // 各棚(幅がバラバラ)からperShelf本ずつ、定尺材から切り出す必要がある
      const widthTally = new Map<number, number>();
      for (const w of g.widths) {
        widthTally.set(w, (widthTally.get(w) ?? 0) + perShelf);
      }
      const cutGroups: CutPieceGroup[] = [...widthTally.entries()].map(([lengthMm, quantity]) => ({
        lengthMm,
        quantity,
      }));
      const plan = optimizeAcrossPricedLengths(cutGroups, g.board.pricePerUnit);

      if (plan) {
        const stdLabel = STANDARD_LENGTHS.find((s) => s.value === plan.barLengthMm)?.label ?? `${plan.barLengthMm}mm`;
        parts.push({
          category: "shelf",
          name: `${g.board.name} ${stdLabel}【棚板用】`,
          quantity: plan.barsNeeded,
          unitPrice: Math.round(plan.totalCost / plan.barsNeeded),
          subtotal: plan.totalCost,
          amazonUrl: buildAmazonUrl(g.board.amazonKeyword),
          note: `${g.count}枚 × ${perShelf}本並べ（カット${plan.totalCutCount}回・端材計${plan.totalWasteMm}mm）`,
          cutPlan: plan,
        });
      }
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

import type { GridDesign, PartItem } from "@/types";
import {
  LUMBER_SPECS,
  SHELF_BOARDS,
  BRACKETS,
  buildAmazonUrl,
  ACCESSORY_MAP,
  BRACKET_MAP,
} from "@/data/products";

// resolveAdj は src/lib/resolvers.ts に統合済み
import { resolveAdjuster as resolveAdj } from "./resolvers";

/** 木材サイズ選定 */
function lumberSize(mm: number) {
  if (mm <= 1820) return { label: "6ft (1820mm)", mult: 1.0 };
  if (mm <= 2438) return { label: "8ft (2438mm)", mult: 1.4 };
  return { label: "10ft (3050mm)", mult: 1.8 };
}

/**
 * グリッドデザインから部材リストを生成
 */
export function calculateGridParts(design: GridDesign): {
  partsList: PartItem[];
  totalEstimate: number;
} {
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

  // ── 柱用木材 (lumber+cutLength でグルーピング) ──
  const lumGroups = new Map<
    string,
    {
      spec: (typeof LUMBER_SPECS)["2x4"];
      count: number;
      cutLen: number;
    }
  >();
  for (const p of design.pillars) {
    const spec = LUMBER_SPECS[p.lumber] ?? LUMBER_SPECS["2x4"];
    const adj = p.adjuster ? resolveAdj(p.adjuster, p.lumber) : null;
    const cut = adj
      ? design.ceilingHeight - adj.cutOffset
      : design.ceilingHeight;
    const k = `${p.lumber}-${cut}`;
    const g = lumGroups.get(k);
    if (g) g.count++;
    else lumGroups.set(k, { spec, count: 1, cutLen: cut });
  }
  for (const [, g] of lumGroups) {
    const sz = lumberSize(g.cutLen);
    const price = Math.round(g.spec.pricePerUnit * sz.mult);
    parts.push({
      category: "lumber",
      name: `${g.spec.name} ${sz.label}【柱用】`,
      quantity: g.count,
      unitPrice: price,
      subtotal: price * g.count,
      amazonUrl: buildAmazonUrl(g.spec.amazonKeyword),
      note: `${g.cutLen}mmにカット`,
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
      const qty = g.count * perShelf;
      parts.push({
        category: "shelf",
        name: `${g.board.name}【棚板用】`,
        quantity: qty,
        unitPrice: g.board.pricePerUnit,
        subtotal: g.board.pricePerUnit * qty,
        amazonUrl: buildAmazonUrl(g.board.amazonKeyword),
        note: `${g.count}枚 × ${perShelf}本並べ`,
      });
    } else {
      let sub = 0;
      for (const w of g.widths) {
        sub += Math.round(g.board.pricePerUnit * (w / 600) * (g.depth / 250));
      }
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

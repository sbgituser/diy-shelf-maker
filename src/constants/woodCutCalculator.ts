// ── 木材カット計算機 定数データ ──────────────────────────

export interface CutItem {
  name: string;
  material: string;
  lengthMm: number;
  quantity: number;
  note: string;
}

/** 標準木材長さ（フィート → mm）。priceMultは6ft(1820mm)を1.0とした価格倍率の目安 */
export const STANDARD_LENGTHS = [
  { label: "6フィート (1,820mm)", value: 1820, priceMult: 1.0 },
  { label: "8フィート (2,438mm)", value: 2438, priceMult: 1.4 },
  { label: "10フィート (3,050mm)", value: 3050, priceMult: 1.8 },
  { label: "12フィート (3,650mm)", value: 3650, priceMult: 2.2 },
];

/** ホームセンターカット料金の目安 */
export const CUT_FEE_PER_CUT = 50; // 円/カット

/** 鋸刃の刃幅の目安(mm)。カットのたびにこの分の長さが失われる */
export const KERF_WIDTH_MM = 3;

/** 棚板材の選択肢（集成材含む） */
export interface ShelfMaterialOption {
  id: string;
  name: string;
  thicknessMm: number;
  pricePerMeter: number; // 円/m（幅300mm換算の目安）
  amazonKeyword: string;
}

export const SHELF_MATERIAL_OPTIONS: ShelfMaterialOption[] = [
  {
    id: "pine-18",
    name: "パイン集成材 18mm厚",
    thicknessMm: 18,
    pricePerMeter: 1500,
    amazonKeyword: "パイン集成材 棚板 18mm",
  },
  {
    id: "pine-24",
    name: "パイン集成材 24mm厚",
    thicknessMm: 24,
    pricePerMeter: 2200,
    amazonKeyword: "パイン集成材 棚板 24mm",
  },
  {
    id: "plywood-12",
    name: "合板 12mm厚",
    thicknessMm: 12,
    pricePerMeter: 800,
    amazonKeyword: "合板 棚板 12mm",
  },
  {
    id: "spf-1x4",
    name: "1×4材 (19mm厚・幅89mm)",
    thicknessMm: 19,
    pricePerMeter: 300,
    amazonKeyword: "1×4 木材 SPF",
  },
  {
    id: "spf-1x6",
    name: "1×6材 (19mm厚・幅140mm)",
    thicknessMm: 19,
    pricePerMeter: 450,
    amazonKeyword: "1×6 木材 SPF",
  },
  {
    id: "spf-2x4",
    name: "2×4材 (38mm厚・幅89mm)",
    thicknessMm: 38,
    pricePerMeter: 600,
    amazonKeyword: "2×4 木材 SPF",
  },
];

/** 棚受け金具の選択肢 */
export interface BracketOption {
  id: string;
  name: string;
  pricePerSet: number; // 1セット（柱2本分）あたり
  amazonKeyword: string;
}

export const BRACKET_OPTIONS: BracketOption[] = [
  {
    id: "l-bracket",
    name: "L字金具",
    pricePerSet: 400,
    amazonKeyword: "L字金具 棚受け 2×4",
  },
  {
    id: "shelf-support",
    name: "棚受け金具（2×4専用）",
    pricePerSet: 600,
    amazonKeyword: "2×4 棚受け 金具",
  },
  {
    id: "channel",
    name: "チャンネルサポート（可動棚）",
    pricePerSet: 1200,
    amazonKeyword: "チャンネルサポート 棚柱",
  },
  {
    id: "dowel",
    name: "ダボ",
    pricePerSet: 200,
    amazonKeyword: "棚ダボ 木製",
  },
];

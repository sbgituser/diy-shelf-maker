import type {
  AdjusterProduct,
  LumberSpec,
  ShelfBoard,
  BracketType,
} from "@/types";

// ── 突っ張りアジャスター ──────────────────────────
export const ADJUSTERS: Record<string, AdjusterProduct> = {
  diawall: {
    id: "diawall",
    name: "ディアウォール",
    nameEn: "DIAWALL",
    cutOffset: 45,
    priceYen: 1100,
    supportedLumber: ["2x4", "1x4"],
    maxLoadKg: 20,
    amazonKeyword: "ディアウォール 2×4 アジャスター",
    description: "バネ式で取り付け簡単。賃貸DIYの定番。",
  },
  diawall_1x4: {
    id: "diawall",
    name: "ディアウォール (1×4用)",
    nameEn: "DIAWALL 1x4",
    cutOffset: 45,
    priceYen: 980,
    supportedLumber: ["1x4"],
    maxLoadKg: 5,
    amazonKeyword: "ディアウォール 1×4 アジャスター",
    description: "1×4材用。軽量な飾り棚やフックに。",
  },
  labrico: {
    id: "labrico",
    name: "ラブリコ",
    nameEn: "LABRICO",
    cutOffset: 95,
    priceYen: 1210,
    supportedLumber: ["2x4", "1x4"],
    maxLoadKg: 20,
    amazonKeyword: "ラブリコ 2×4 アジャスター",
    description: "ジャッキ式で微調整しやすい。デザイン性◎。",
  },
  labrico_1x4: {
    id: "labrico",
    name: "ラブリコ (1×4用)",
    nameEn: "LABRICO 1x4",
    cutOffset: 95,
    priceYen: 1078,
    supportedLumber: ["1x4"],
    maxLoadKg: 5,
    amazonKeyword: "ラブリコ 1×4 アジャスター",
    description: "1×4材用。スリムで省スペース。",
  },
  labrico_strong: {
    id: "labrico_strong",
    name: "ラブリコ 強力タイプ",
    nameEn: "LABRICO STRONG",
    cutOffset: 120,
    priceYen: 1870,
    supportedLumber: ["2x4"],
    maxLoadKg: 40,
    amazonKeyword: "ラブリコ 2×4 強力 アジャスター",
    description: "耐荷重40kg。重い本棚にも対応。",
  },
  wallist: {
    id: "wallist",
    name: "ウォリスト",
    nameEn: "WALIST",
    cutOffset: 60,
    priceYen: 1320,
    supportedLumber: ["2x4"],
    maxLoadKg: 30,
    amazonKeyword: "ウォリスト 2×4 アジャスター",
    description: "ネジ式で強力固定。大型壁面収納向き。",
  },
};

// ── 木材規格 ──────────────────────────────────
export const LUMBER_SPECS: Record<string, LumberSpec> = {
  "2x4": {
    id: "2x4",
    name: "2×4材 (ツーバイフォー)",
    widthMm: 89,
    depthMm: 38,
    pricePerUnit: 600,
    amazonKeyword: "2×4 木材 SPF ホワイトウッド",
    usableAsShelf: true,
    shelfLabel: "2×4材 (89×38mm) — 高強度",
  },
  "2x6": {
    id: "2x6",
    name: "2×6材 (ツーバイシックス)",
    widthMm: 140,
    depthMm: 38,
    pricePerUnit: 900,
    amazonKeyword: "2×6 木材 SPF",
    usableAsShelf: true,
    shelfLabel: "2×6材 (140×38mm) — 最高強度・幅広",
  },
  "1x4": {
    id: "1x4",
    name: "1×4材 (ワンバイフォー)",
    widthMm: 89,
    depthMm: 19,
    pricePerUnit: 300,
    amazonKeyword: "1×4 木材 SPF",
    usableAsShelf: true,
    shelfLabel: "1×4材 (89×19mm) — 軽量棚板向き",
  },
  "1x6": {
    id: "1x6",
    name: "1×6材 (ワンバイシックス)",
    widthMm: 140,
    depthMm: 19,
    pricePerUnit: 450,
    amazonKeyword: "1×6 木材 SPF",
    usableAsShelf: true,
    shelfLabel: "1×6材 (140×19mm) — 幅広軽量棚板",
  },
};

// ── 棚板 ──────────────────────────────────────
export const SHELF_BOARDS: ShelfBoard[] = [
  {
    id: "pine-18",
    name: "パイン集成材 (18mm厚)",
    thicknessMm: 18,
    fixedDepthMm: 0,
    pricePerUnit: 1200,
    amazonKeyword: "パイン集成材 棚板 18mm",
    strength: "medium",
  },
  {
    id: "2x4-shelf",
    name: "2×4材を棚板に (38mm厚)",
    thicknessMm: 38,
    fixedDepthMm: 89,
    pricePerUnit: 600,
    amazonKeyword: "2×4 木材 SPF ホワイトウッド",
    strength: "heavy",
  },
  {
    id: "1x4-shelf",
    name: "1×4材を棚板に (19mm厚)",
    thicknessMm: 19,
    fixedDepthMm: 89,
    pricePerUnit: 300,
    amazonKeyword: "1×4 木材 SPF ホワイトウッド",
    strength: "light",
  },
  {
    id: "paulownia-15",
    name: "桐板 (15mm厚)",
    thicknessMm: 15,
    fixedDepthMm: 0,
    pricePerUnit: 800,
    amazonKeyword: "桐 棚板 15mm",
    strength: "light",
  },
  {
    id: "oak-20",
    name: "オーク集成材 (20mm厚)",
    thicknessMm: 20,
    fixedDepthMm: 0,
    pricePerUnit: 2500,
    amazonKeyword: "オーク 集成材 棚板 20mm",
    strength: "heavy",
  },
];

// ── 棚受け金具 ──────────────────────────────────
export const BRACKETS: BracketType[] = [
  {
    id: "l-bracket",
    name: "L字金具 (標準)",
    pricePerPair: 400,
    maxLoadKg: 15,
    amazonKeyword: "L字金具 棚受け 2×4",
  },
  {
    id: "shelf-support",
    name: "棚受け金具 (2×4専用)",
    pricePerPair: 600,
    maxLoadKg: 20,
    amazonKeyword: "2×4 棚受け 金具 ラブリコ",
  },
  {
    id: "channel-support",
    name: "チャンネルサポート (可動棚)",
    pricePerPair: 1200,
    maxLoadKg: 25,
    amazonKeyword: "チャンネルサポート 棚柱 可動棚",
  },
];

// ── Amazon アフィリエイトタグ ──
export const AMAZON_ASSOCIATE_TAG = "kurasplus-22";

export function buildAmazonUrl(keyword: string): string {
  return `https://www.amazon.co.jp/s?k=${encodeURIComponent(keyword)}&tag=${AMAZON_ASSOCIATE_TAG}`;
}

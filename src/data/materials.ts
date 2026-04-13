/**
 * 材料マスタデータ
 * 材料計算シミュレーターで使用する木材・金具・工具の一覧
 */

export interface LumberMaterial {
  id: string;
  name: string;
  /** 断面寸法 (mm) */
  widthMm: number;
  thicknessMm: number;
  /** 標準長さ (mm) */
  standardLengths: number[];
  /** 1本あたりの参考価格 (6ft=1820mm基準) */
  pricePerUnit: number;
  /** 棚板として使用可能か */
  asShelf: boolean;
  amazonKeyword: string;
}

export interface HardwareMaterial {
  id: string;
  name: string;
  /** 参考単価（円） */
  unitPrice: number;
  /** 単位（個、セット、箱など） */
  unit: string;
  amazonKeyword: string;
  description: string;
}

export interface ToolItem {
  id: string;
  name: string;
  /** 参考価格（円） */
  price: number;
  /** 必須 or あると便利 */
  required: boolean;
  amazonKeyword: string;
  description: string;
}

// ── 木材リスト ──
export const LUMBER_MATERIALS: LumberMaterial[] = [
  {
    id: "2x4-spf",
    name: "SPF 2×4材",
    widthMm: 89,
    thicknessMm: 38,
    standardLengths: [1820, 2438, 3050],
    pricePerUnit: 600,
    asShelf: true,
    amazonKeyword: "2×4 木材 SPF ホワイトウッド",
  },
  {
    id: "1x4-spf",
    name: "SPF 1×4材",
    widthMm: 89,
    thicknessMm: 19,
    standardLengths: [1820, 2438],
    pricePerUnit: 300,
    asShelf: true,
    amazonKeyword: "1×4 木材 SPF",
  },
  {
    id: "2x6-spf",
    name: "SPF 2×6材",
    widthMm: 140,
    thicknessMm: 38,
    standardLengths: [1820, 2438, 3050],
    pricePerUnit: 900,
    asShelf: true,
    amazonKeyword: "2×6 木材 SPF",
  },
  {
    id: "1x6-spf",
    name: "SPF 1×6材",
    widthMm: 140,
    thicknessMm: 19,
    standardLengths: [1820, 2438],
    pricePerUnit: 450,
    asShelf: true,
    amazonKeyword: "1×6 木材 SPF",
  },
  {
    id: "pine-laminated-18",
    name: "パイン集成材 18mm厚",
    widthMm: 300,
    thicknessMm: 18,
    standardLengths: [600, 900, 1200, 1800],
    pricePerUnit: 1200,
    asShelf: true,
    amazonKeyword: "パイン集成材 棚板 18mm",
  },
  {
    id: "pine-laminated-25",
    name: "パイン集成材 25mm厚",
    widthMm: 300,
    thicknessMm: 25,
    standardLengths: [600, 900, 1200, 1800],
    pricePerUnit: 1800,
    asShelf: true,
    amazonKeyword: "パイン集成材 棚板 25mm",
  },
  {
    id: "plywood-12",
    name: "合板 12mm厚",
    widthMm: 900,
    thicknessMm: 12,
    standardLengths: [1800],
    pricePerUnit: 1500,
    asShelf: true,
    amazonKeyword: "合板 12mm 棚板",
  },
  {
    id: "melamine-16",
    name: "化粧板（メラミン） 16mm厚",
    widthMm: 300,
    thicknessMm: 16,
    standardLengths: [600, 900, 1200, 1800],
    pricePerUnit: 1600,
    asShelf: true,
    amazonKeyword: "メラミン化粧板 棚板 白",
  },
];

// ── 金具リスト ──
export const HARDWARE_MATERIALS: HardwareMaterial[] = [
  {
    id: "labrico-2x4",
    name: "ラブリコ 2×4アジャスター",
    unitPrice: 1210,
    unit: "セット",
    amazonKeyword: "ラブリコ 2×4 アジャスター",
    description: "天井と床を突っ張る2×4材用アジャスター",
  },
  {
    id: "diawall-2x4",
    name: "ディアウォール 2×4アジャスター",
    unitPrice: 1100,
    unit: "セット",
    amazonKeyword: "ディアウォール 2×4 アジャスター",
    description: "バネ式の2×4材用アジャスター",
  },
  {
    id: "l-bracket",
    name: "L字金具",
    unitPrice: 200,
    unit: "個",
    amazonKeyword: "L字金具 棚受け",
    description: "棚板を支える基本的な金具",
  },
  {
    id: "shelf-bracket",
    name: "棚受け金具（2×4専用）",
    unitPrice: 300,
    unit: "個",
    amazonKeyword: "2×4 棚受け 金具",
    description: "2×4材にフィットする専用棚受け",
  },
  {
    id: "channel-support",
    name: "チャンネルサポート",
    unitPrice: 600,
    unit: "本",
    amazonKeyword: "チャンネルサポート 棚柱",
    description: "棚の高さを自由に変えられる棚柱",
  },
  {
    id: "wood-screw-32",
    name: "木ネジ 3.8×32mm",
    unitPrice: 500,
    unit: "箱(50本)",
    amazonKeyword: "木ネジ 3.8×32 ステンレス",
    description: "棚受け固定用の標準ネジ",
  },
  {
    id: "wood-screw-50",
    name: "木ネジ 3.8×50mm",
    unitPrice: 600,
    unit: "箱(50本)",
    amazonKeyword: "木ネジ 3.8×50 ステンレス",
    description: "厚い棚板や補強に使う長めのネジ",
  },
  {
    id: "wood-dowel-8",
    name: "木ダボ 8mm",
    unitPrice: 300,
    unit: "袋(30本)",
    amazonKeyword: "木ダボ 8mm 棚受け",
    description: "目立たない棚受け用の木ダボ",
  },
];

// ── 工具リスト ──
export const TOOL_ITEMS: ToolItem[] = [
  {
    id: "driver",
    name: "電動ドライバー",
    price: 4000,
    required: true,
    amazonKeyword: "電動ドライバー DIY 初心者",
    description: "ネジ締めに必須。インパクトドライバーなら更に効率的。",
  },
  {
    id: "measure",
    name: "メジャー（5m）",
    price: 500,
    required: true,
    amazonKeyword: "メジャー 5m コンベックス",
    description: "天井高や木材の長さを測るのに必須。",
  },
  {
    id: "level",
    name: "水平器",
    price: 800,
    required: true,
    amazonKeyword: "水平器 300mm マグネット",
    description: "棚板の水平を確認するために必要。",
  },
  {
    id: "saw",
    name: "のこぎり",
    price: 1500,
    required: false,
    amazonKeyword: "のこぎり 木工 DIY",
    description: "木材カットに。ホームセンターのカットサービスを使えば不要。",
  },
  {
    id: "sandpaper",
    name: "紙やすり（#120・#240セット）",
    price: 300,
    required: false,
    amazonKeyword: "紙やすり セット 木工",
    description: "カット面や角のバリ取り・面取りに。仕上がりが向上。",
  },
  {
    id: "pencil",
    name: "鉛筆・差し金",
    price: 600,
    required: true,
    amazonKeyword: "差し金 DIY 直角",
    description: "位置合わせや線引きに。差し金で直角を出す。",
  },
  {
    id: "drill-bit",
    name: "下穴ドリルビット",
    price: 800,
    required: false,
    amazonKeyword: "下穴ドリルビット セット 木工",
    description: "ネジの下穴を開けると割れ防止になる。SPF材には推奨。",
  },
  {
    id: "clamp",
    name: "F型クランプ（2本セット）",
    price: 1200,
    required: false,
    amazonKeyword: "F型クランプ 200mm DIY",
    description: "材料の仮固定に便利。一人作業時に重宝する。",
  },
];

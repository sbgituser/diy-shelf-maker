// ── 木材費用見積もり 定数データ ──────────────────────────

export interface MaterialItem {
  id: string;
  name: string;
  category: "木材" | "金具" | "ネジ・ビス" | "塗装" | "工具";
  unit: string;
  priceMin: number;
  priceMax: number;
  amazonKeyword: string;
  note: string;
}

export interface ShelfConfig {
  width: number;    // 幅 (mm)
  depth: number;    // 奥行 (mm)
  height: number;   // 高さ (mm)
  shelves: number;  // 棚板枚数
  material: string; // 板材の種類
  supportType: string; // 支柱方式
}

export interface CostEstimate {
  items: {
    material: MaterialItem;
    quantity: number;
    subtotal: [number, number];
  }[];
  totalMin: number;
  totalMax: number;
}

// ── 板材の種類 ──
export interface BoardType {
  id: string;
  name: string;
  widthMm: number;   // 規格幅
  lengthMm: number;  // 規格長さ
  thicknessMm: number;
  priceMin: number;
  priceMax: number;
  amazonKeyword: string;
}

export const BOARD_TYPES: BoardType[] = [
  { id: "pine-600", name: "パイン集成材 600×300×18mm", widthMm: 300, lengthMm: 600, thicknessMm: 18, priceMin: 1200, priceMax: 1800, amazonKeyword: "パイン集成材 600 300 18mm" },
  { id: "pine-900", name: "パイン集成材 900×300×18mm", widthMm: 300, lengthMm: 900, thicknessMm: 18, priceMin: 1800, priceMax: 2500, amazonKeyword: "パイン集成材 900 300 18mm" },
  { id: "1x4-6f", name: "1×4材 6F（約1820mm）", widthMm: 89, lengthMm: 1820, thicknessMm: 19, priceMin: 300, priceMax: 500, amazonKeyword: "1×4材 6フィート SPF" },
  { id: "2x4-6f", name: "2×4材 6F（約1820mm）", widthMm: 89, lengthMm: 1820, thicknessMm: 38, priceMin: 400, priceMax: 700, amazonKeyword: "2×4材 6フィート SPF" },
  { id: "mdf-600", name: "MDF 600×300×15mm", widthMm: 300, lengthMm: 600, thicknessMm: 15, priceMin: 500, priceMax: 800, amazonKeyword: "MDF ボード 600 300 15mm" },
];

// ── 支柱方式 ──
export interface SupportTypeOption {
  id: string;
  name: string;
  description: string;
  /** この方式で必要になる追加材料IDリスト */
  requiredMaterials: string[];
}

export const SUPPORT_TYPE_OPTIONS: SupportTypeOption[] = [
  { id: "wall-mount", name: "壁付けL字金具", description: "壁にL字金具で直接固定する方式", requiredMaterials: ["l-bracket", "wood-screw", "anchor-bolt"] },
  { id: "diawall", name: "ディアウォール", description: "バネ式の突っ張りアジャスター。賃貸向け", requiredMaterials: ["diawall-set", "2x4-pillar", "shelf-bracket"] },
  { id: "labrico", name: "ラブリコ", description: "ジャッキ式の突っ張りアジャスター。微調整が簡単", requiredMaterials: ["labrico-set", "2x4-pillar", "shelf-bracket"] },
  { id: "standalone", name: "独立型（棚柱）", description: "棚柱とダボで自立する方式", requiredMaterials: ["shelf-column", "shelf-dabo", "wood-screw", "2x4-pillar"] },
];

// ── 材料データ（20種以上）──
export const MATERIALS: MaterialItem[] = [
  // 木材
  { id: "pine-board-600", name: "パイン集成材 600×300×18mm", category: "木材", unit: "枚", priceMin: 1200, priceMax: 1800, amazonKeyword: "パイン集成材 600 300 棚板", note: "棚板用。自然な木目が人気" },
  { id: "pine-board-900", name: "パイン集成材 900×300×18mm", category: "木材", unit: "枚", priceMin: 1800, priceMax: 2500, amazonKeyword: "パイン集成材 900 300 棚板", note: "幅広棚板用" },
  { id: "1x4-lumber", name: "1×4材 6F", category: "木材", unit: "本", priceMin: 300, priceMax: 500, amazonKeyword: "1×4材 6フィート SPF", note: "軽量棚板・補強材に" },
  { id: "2x4-lumber", name: "2×4材 6F", category: "木材", unit: "本", priceMin: 400, priceMax: 700, amazonKeyword: "2×4材 6フィート SPF", note: "支柱・丈夫な棚板に" },
  { id: "2x4-pillar", name: "2×4材 6F（支柱用）", category: "木材", unit: "本", priceMin: 400, priceMax: 700, amazonKeyword: "2×4材 6フィート SPF", note: "支柱として使用" },
  { id: "mdf-board", name: "MDF 600×300×15mm", category: "木材", unit: "枚", priceMin: 500, priceMax: 800, amazonKeyword: "MDF ボード 棚板", note: "安価で加工しやすい" },

  // 金具
  { id: "l-bracket", name: "L字棚受け金具", category: "金具", unit: "個", priceMin: 200, priceMax: 500, amazonKeyword: "L字 棚受け 金具", note: "壁付け棚の基本金具" },
  { id: "diawall-set", name: "ディアウォール上下セット", category: "金具", unit: "セット", priceMin: 800, priceMax: 1200, amazonKeyword: "ディアウォール 2×4 アジャスター", note: "支柱1本につき1セット" },
  { id: "labrico-set", name: "ラブリコアジャスター", category: "金具", unit: "セット", priceMin: 900, priceMax: 1300, amazonKeyword: "ラブリコ 2×4 アジャスター", note: "支柱1本につき1セット" },
  { id: "shelf-bracket", name: "棚受け金具（左右ペア）", category: "金具", unit: "組", priceMin: 300, priceMax: 800, amazonKeyword: "棚受け金具 2×4", note: "棚板1枚につき1組" },
  { id: "shelf-column", name: "棚柱（ダボレール）", category: "金具", unit: "本", priceMin: 600, priceMax: 1000, amazonKeyword: "棚柱 ダボレール ステンレス", note: "高さ調整可能な棚柱" },
  { id: "shelf-dabo", name: "棚受けダボ", category: "金具", unit: "個", priceMin: 50, priceMax: 100, amazonKeyword: "棚受け ダボ 棚ダボ", note: "棚板1枚につき4個" },
  { id: "anchor-bolt", name: "壁用アンカーボルト", category: "金具", unit: "本", priceMin: 100, priceMax: 300, amazonKeyword: "壁 アンカーボルト DIY", note: "石膏ボード壁用の固定具" },

  // ネジ・ビス
  { id: "wood-screw", name: "木ネジセット", category: "ネジ・ビス", unit: "箱", priceMin: 300, priceMax: 600, amazonKeyword: "木ネジ セット DIY", note: "各サイズ入りセット" },
  { id: "coarse-thread", name: "コースレッド箱入り", category: "ネジ・ビス", unit: "箱", priceMin: 500, priceMax: 800, amazonKeyword: "コースレッド 木工用 ビス", note: "木材同士の接合に" },

  // 塗装
  { id: "watco-oil", name: "ワトコオイル 200ml", category: "塗装", unit: "缶", priceMin: 1200, priceMax: 1800, amazonKeyword: "ワトコオイル 200ml", note: "天然オイル仕上げ。初心者向け" },
  { id: "briwax", name: "ブライワックス", category: "塗装", unit: "缶", priceMin: 2500, priceMax: 3500, amazonKeyword: "ブライワックス", note: "アンティーク風仕上げに" },
  { id: "water-urethane", name: "水性ウレタンニス", category: "塗装", unit: "缶", priceMin: 800, priceMax: 1500, amazonKeyword: "水性ウレタンニス 木工", note: "耐久性・耐水性が高い" },

  // 工具
  { id: "drill-driver", name: "ドリルドライバー", category: "工具", unit: "台", priceMin: 3000, priceMax: 8000, amazonKeyword: "ドリルドライバー 充電式 DIY", note: "ネジ締め・穴あけに必須" },
  { id: "saw", name: "のこぎり", category: "工具", unit: "本", priceMin: 1000, priceMax: 3000, amazonKeyword: "のこぎり 木工 DIY", note: "木材カットに" },
  { id: "sandpaper-set", name: "サンドペーパーセット", category: "工具", unit: "セット", priceMin: 300, priceMax: 600, amazonKeyword: "サンドペーパー セット 木工", note: "仕上げの研磨に" },
  { id: "measure-tape", name: "メジャー（コンベックス）", category: "工具", unit: "個", priceMin: 300, priceMax: 800, amazonKeyword: "コンベックス メジャー DIY", note: "採寸に必須" },
  { id: "level", name: "水平器", category: "工具", unit: "個", priceMin: 500, priceMax: 1500, amazonKeyword: "水平器 DIY", note: "水平確認に" },
];

// ── 材料Mapアクセス ──
export const MATERIALS_MAP = new Map(MATERIALS.map((m) => [m.id, m]));

// ── 板材選択肢のMap ──
export const BOARD_TYPES_MAP = new Map(BOARD_TYPES.map((b) => [b.id, b]));

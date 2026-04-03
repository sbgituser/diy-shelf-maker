// ── 棚板耐荷重計算 定数データ ──────────────────────────

export interface WoodMaterial {
  id: string;
  name: string;
  density: number;        // 密度 (kg/m³)
  bendingStrength: number; // 曲げ強度 (MPa)
  elasticModulus: number;  // 弾性率 (MPa)
  priceRange: string;
  amazonKeyword: string;
}

export interface SupportType {
  id: string;
  name: string;
  factor: number; // 荷重係数（両端支持=1を基準）
  icon: string;
  description: string;
}

export interface LoadPreset {
  id: string;
  name: string;
  weightPerCm: number; // 1cmあたりの重量 (kg)
  description: string;
  icon: string;
}

// ── 木材データ（7種）──
export const WOOD_MATERIALS: WoodMaterial[] = [
  {
    id: "pine",
    name: "パイン集成材",
    density: 450,
    bendingStrength: 35,
    elasticModulus: 8500,
    priceRange: "¥1,500〜3,000",
    amazonKeyword: "パイン集成材 棚板",
  },
  {
    id: "mdf",
    name: "MDF",
    density: 750,
    bendingStrength: 25,
    elasticModulus: 3500,
    priceRange: "¥800〜1,500",
    amazonKeyword: "MDF ボード 棚板",
  },
  {
    id: "plywood",
    name: "合板",
    density: 550,
    bendingStrength: 30,
    elasticModulus: 7000,
    priceRange: "¥1,000〜2,500",
    amazonKeyword: "合板 棚板 カット",
  },
  {
    id: "spf",
    name: "SPF材",
    density: 450,
    bendingStrength: 35,
    elasticModulus: 9000,
    priceRange: "¥300〜800",
    amazonKeyword: "SPF材 1×4 棚板",
  },
  {
    id: "tamo",
    name: "タモ集成材",
    density: 650,
    bendingStrength: 70,
    elasticModulus: 12000,
    priceRange: "¥3,000〜6,000",
    amazonKeyword: "タモ 集成材 棚板",
  },
  {
    id: "lauan",
    name: "ラワン合板",
    density: 500,
    bendingStrength: 28,
    elasticModulus: 6500,
    priceRange: "¥800〜1,800",
    amazonKeyword: "ラワン合板 棚板",
  },
  {
    id: "osb",
    name: "OSB",
    density: 600,
    bendingStrength: 20,
    elasticModulus: 4500,
    priceRange: "¥1,000〜2,000",
    amazonKeyword: "OSB ボード 棚",
  },
];

export const WOOD_MATERIALS_MAP: Record<string, WoodMaterial> = Object.fromEntries(
  WOOD_MATERIALS.map((m) => [m.id, m])
);

// ── 支持方式 ──
export const SUPPORT_TYPES: SupportType[] = [
  {
    id: "both_ends",
    name: "両端支持",
    factor: 1.0,
    icon: "┣━━━━━┫",
    description: "左右2点で支える標準的な方式",
  },
  {
    id: "cantilever",
    name: "片持ち",
    factor: 0.25,
    icon: "┣━━━━━",
    description: "片側だけで支える方式（耐荷重1/4）",
  },
  {
    id: "three_point",
    name: "3点支持",
    factor: 2.0,
    icon: "┣━━┳━━┫",
    description: "中央にも支点を追加（耐荷重2倍）",
  },
  {
    id: "l_bracket",
    name: "壁付けL字金具",
    factor: 1.0,
    icon: "┠━━━━━┨",
    description: "壁にL字金具で固定する方式",
  },
  {
    id: "dowel",
    name: "ダボ",
    factor: 0.8,
    icon: "┃○━━○┃",
    description: "ダボで棚板を受ける方式（やや弱い）",
  },
];

export const SUPPORT_TYPES_MAP: Record<string, SupportType> = Object.fromEntries(
  SUPPORT_TYPES.map((s) => [s.id, s])
);

// ── 荷重プリセット ──
export const LOAD_PRESETS: LoadPreset[] = [
  {
    id: "bunko",
    name: "文庫本1列",
    weightPerCm: 0.8,
    description: "文庫本を1列に並べた場合",
    icon: "📖",
  },
  {
    id: "hardcover",
    name: "ハードカバー1列",
    weightPerCm: 1.2,
    description: "ハードカバー書籍を1列に並べた場合",
    icon: "📕",
  },
  {
    id: "manga",
    name: "漫画1列",
    weightPerCm: 0.9,
    description: "漫画を1列に並べた場合",
    icon: "📚",
  },
  {
    id: "a4file",
    name: "A4ファイル",
    weightPerCm: 1.5,
    description: "A4ファイルを1列に並べた場合",
    icon: "📁",
  },
  {
    id: "dishes",
    name: "食器",
    weightPerCm: 2.0,
    description: "食器を並べた場合",
    icon: "🍽️",
  },
  {
    id: "plant",
    name: "観葉植物",
    weightPerCm: 0,
    description: "鉢あたり3〜10kg（個別計算）",
    icon: "🪴",
  },
];

// ── 安全係数 ──
export const SAFETY_FACTOR = 3;

// ── たわみ許容基準 ──
export const DEFLECTION_SAFE_RATIO = 300;   // L/300以下 → 安全
export const DEFLECTION_WARN_RATIO = 200;   // L/200以下 → 注意
// それ以上 → 危険

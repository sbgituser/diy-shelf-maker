// ── 突っ張りアジャスター製品定義 ──
export type AdjusterBrand = "diawall" | "labrico" | "labrico_strong" | "wallist";

export interface AdjusterProduct {
  id: AdjusterBrand;
  name: string;
  nameEn: string;
  /** 天井高から引く長さ (mm) */
  cutOffset: number;
  /** アジャスター1セットの参考価格 (税込) */
  priceYen: number;
  /** 対応木材の規格リスト */
  supportedLumber: string[];
  /** 耐荷重 (kg) — 柱1本あたり */
  maxLoadKg: number;
  /** Amazon 検索キーワード */
  amazonKeyword: string;
  /** 特徴の一言説明 */
  description: string;
}

// ── 木材規格 ──
export interface LumberSpec {
  id: string;
  name: string;
  /** 断面幅 (mm) — 広い面 */
  widthMm: number;
  /** 断面厚さ (mm) — 狭い面 */
  depthMm: number;
  /** 1本あたりの参考価格 (6フィート≒1820mm) */
  pricePerUnit: number;
  amazonKeyword: string;
  /** 棚板としても使えるか */
  usableAsShelf: boolean;
  /** 棚板として使う場合のラベル */
  shelfLabel?: string;
}

// ── 棚板の種類 ──
export interface ShelfBoard {
  id: string;
  name: string;
  /** 板の厚さ (mm) */
  thicknessMm: number;
  /** 板の奥行 (mm) — 固定の場合。0なら可変 */
  fixedDepthMm: number;
  /** 参考価格 (600mm幅あたり) */
  pricePerUnit: number;
  amazonKeyword: string;
  /** 強度レベル: light=軽量物, medium=書籍など, heavy=重量物 */
  strength: "light" | "medium" | "heavy";
}

// ── 棚受け金具 ──
export interface BracketType {
  id: string;
  name: string;
  /** 1組（左右）の参考価格 */
  pricePerPair: number;
  /** 耐荷重 (kg) */
  maxLoadKg: number;
  amazonKeyword: string;
  /** 設計図に表示するアイコン (SVG path or emoji) */
  icon?: string;
  /** 補足説明 */
  description?: string;
}

// ── 装飾品・アクセサリー ──
export type AccessoryCategory = "divider" | "hook" | "holder" | "tray" | "lighting" | "other";

export interface AccessoryProduct {
  id: string;
  name: string;
  /** カテゴリ */
  category: AccessoryCategory;
  /** 設計図に表示するアイコン文字 (emoji) */
  icon: string;
  /** 参考価格 (税込) */
  priceYen: number;
  /** Amazon 検索キーワード */
  amazonKeyword: string;
  /** 概要説明 */
  description: string;
  /** 検索用タグ */
  tags: string[];
}

// ── グリッドに配置された装飾品 ──
export interface GridAccessory {
  id: string;
  /** 装飾品の製品ID */
  productId: string;
  /** 取り付け先の棚板ID */
  shelfId: string;
  /** 棚板の上に配置するか下に配置するか */
  placement: "above" | "below";
  /** 棚板の左端からの水平オフセット (mm) */
  offsetX: number;
}

// ── レイアウトタイプ ──
export type LayoutType = "straight" | "corner" | "desk";

// ── 柱の向き ──
/** short: 短辺を壁側(奥行浅・正面幅広)  long: 長辺を壁側(奥行深・正面幅狭) */
export type PillarOrientation = "short" | "long";

// ── ユーザー入力パラメータ ──
export interface DesignInput {
  /** 天井高 (mm) */
  ceilingHeight: number;
  /** 選択アジャスター */
  adjuster: AdjusterBrand;
  /** 柱の木材規格 */
  pillarLumber: string;
  /** 柱の本数 (2本=1スパン棚, 3本=2スパン棚) */
  pillarCount: number;
  /** 棚板の枚数 */
  shelfCount: number;
  /** 棚板の幅 (mm) — 全体のデフォルト */
  shelfWidth: number;
  /** 棚板の奥行 (mm) */
  shelfDepth: number;
  /** 棚板ごとの個別幅 (mm)。未設定の棚は shelfWidth を使用 */
  shelfWidths?: number[];
  /** 棚板の材質ID */
  shelfMaterial: string;
  /** 棚間隔の配列 (mm) */
  shelfSpacings: number[];
  /** 柱の向き */
  pillarOrientation: PillarOrientation;
  /** レイアウトタイプ */
  layout: LayoutType;
  /** 天井まで突っ張るか (falseなら自立型) */
  fullHeight: boolean;
  /** 自立型の場合の棚の高さ (mm) */
  unitHeight?: number;
}

// ── 計算結果 ──
export interface DesignResult {
  /** 柱の木材カット長 (mm) */
  pillarLength: number;
  /** 柱に使う木材規格 */
  lumberSpec: LumberSpec;
  /** アジャスター情報 */
  adjuster: AdjusterProduct;
  /** 部材リスト */
  partsList: PartItem[];
  /** 合計参考価格 */
  totalEstimate: number;
  /** 各棚の高さ (mm, 床からの距離) */
  shelfHeights: number[];
  /** 棚板の材質情報 */
  shelfBoard: ShelfBoard;
}

export interface PartItem {
  category: "adjuster" | "lumber" | "shelf" | "bracket" | "screw" | "accessory";
  name: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  amazonUrl: string;
  note?: string;
}

// ── グリッドエディタ型 ──
export interface GridPillar {
  id: string;
  /** 左端からの水平位置 (mm) */
  x: number;
  /** 柱の木材規格 */
  lumber: string;
  /** アジャスターブランド (null = アジャスターなし) */
  adjuster: AdjusterBrand | null;
}

export interface GridShelf {
  id: string;
  /** 左側の柱ID */
  leftPillarId: string;
  /** 右側の柱ID */
  rightPillarId: string;
  /** 床からの高さ (mm) */
  y: number;
  /** 棚板の材質ID */
  material: string;
  /** 棚板の奥行 (mm) */
  depth: number;
  /** 棚受け金具ID (未指定時はデフォルト) */
  bracketId?: string;
}

export interface GridDesign {
  /** 天井高 (mm) */
  ceilingHeight: number;
  /** 配置された柱 */
  pillars: GridPillar[];
  /** 配置された棚板 */
  shelves: GridShelf[];
  /** 配置された装飾品 */
  accessories: GridAccessory[];
  /** 全棚板共通の棚受け金具ID (個別指定がない場合に使用) */
  defaultBracketId: string;
}

// ── パーツ辞典 ──
export type PartCategory =
  | "adjuster" | "lumber" | "board" | "bracket"
  | "fastener" | "finish" | "tool" | "accessory";

export interface DictionaryPart {
  id: string;
  name: string;
  nameEn: string;
  category: PartCategory;
  description: string;      // 80-120字
  details: string;           // 200-350字
  specs: { label: string; value: string }[];  // 3-4個
  useCases: string[];        // 3個
  tips: string[];            // 2個
  relatedParts: string[];    // 2-3個
  amazonKeyword: string;
  priceRange: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  faq: { question: string; answer: string }[];  // 2問
  /** コンテンツ最終更新日（YYYY-MM-DD） */
  updatedAt?: string;
}

export interface PartCategoryInfo {
  id: PartCategory;
  name: string;
  nameEn: string;
  description: string;  // 100-200字
  icon: string;
  slug: string;
  /** コンテンツ最終更新日（YYYY-MM-DD） */
  updatedAt?: string;
}

// ── DIYプロジェクトデータベース ──
export type RoomType =
  | "1r" | "1k" | "1ldk" | "family" | "kids"
  | "kitchen" | "entrance" | "workspace";

export interface ProjectMaterial {
  name: string;
  spec: string;
  quantity: number;
  unitPrice: number;
  amazonAsin?: string;
}

export interface ProjectTool {
  name: string;
  optional?: boolean;
  amazonKeyword?: string;
}

export interface ProjectStep {
  title: string;
  description: string;
}

export interface ProjectAmazonProduct {
  name: string;
  asin: string;
  price: number;
  description: string;
}

export interface DIYProject {
  id: string;
  title: string;
  description: string;
  roomType: RoomType;
  difficulty: 1 | 2 | 3 | 4 | 5;
  estimatedCost: number;
  estimatedTime: string;
  dimensions: { w: number; h: number; d: number };
  materials: ProjectMaterial[];
  tools: ProjectTool[];
  steps: ProjectStep[];
  tags: string[];
  amazonProducts: ProjectAmazonProduct[];
  seoKeywords: string[];
  updatedAt?: string;
}

export const ROOM_TYPE_LABELS: Record<RoomType, string> = {
  "1r": "1R",
  "1k": "1K",
  "1ldk": "1LDK",
  family: "ファミリー",
  kids: "子供部屋",
  kitchen: "キッチン",
  entrance: "玄関",
  workspace: "ワークスペース",
};

export const ROOM_TYPE_DESCRIPTIONS: Record<RoomType, string> = {
  "1r": "限られたスペースを有効活用する一人暮らし向けの棚。省スペース＆賃貸OKの設計が中心です。",
  "1k": "キッチンとリビングが分かれた1K向け。コンパクトながら機能的な収納棚をご紹介。",
  "1ldk": "リビングダイニングのある間取り向け。見せる収納やインテリアとしても映える棚が揃います。",
  family: "ファミリー向けの大容量収納棚。リビングや寝室の壁面を最大限に活用する設計です。",
  kids: "子供部屋向けの安全で使いやすい棚。成長に合わせて高さや段数を調整できる設計です。",
  kitchen: "キッチンの限られたスペースを活用する収納棚。調味料ラック・食器棚・レンジ台など。",
  entrance: "玄関の省スペース収納。靴棚・傘立て・鍵掛けなど、帰宅動線を整える棚の設計です。",
  workspace: "デスク周りの生産性を高める収納棚。モニター上・デスクサイドの収納を充実させます。",
};

// ── テンプレート ──
export interface ShelfTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  /** デフォルト設定値 */
  defaults: Partial<DesignInput>;
  /** SEO用キーワード */
  keywords: string[];
  /** コンテンツ最終更新日（YYYY-MM-DD） */
  updatedAt?: string;
}

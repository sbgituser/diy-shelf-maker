export type ShelfMountType = "labrico" | "diawall" | "wallist" | "freestanding";
export type ShelfBoardType =
  | "spf-2x4"
  | "spf-1x4"
  | "pine-18"
  | "pine-25"
  | "plywood-12"
  | "melamine-16";

export interface MaterialCalcInput {
  widthCm: number;
  heightCm: number;
  depthCm: number;
  shelfCount: number;
  boardType: ShelfBoardType;
  mountType: ShelfMountType;
}

export interface MaterialCalcItem {
  category: "lumber" | "hardware" | "tool";
  name: string;
  spec: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  amazonKeyword: string;
}

export interface MaterialCalcResult {
  items: MaterialCalcItem[];
  totalCost: number;
  pillarCount: number;
  pillarLengthMm: number;
  shelfWidthMm: number;
}

/** Adjuster unit price per mount type */
const ADJUSTER_PRICE: Record<Exclude<ShelfMountType, "freestanding">, number> = {
  labrico: 1210,
  diawall: 1100,
  wallist: 1320,
};

/** Adjuster display names */
const ADJUSTER_NAME: Record<Exclude<ShelfMountType, "freestanding">, string> = {
  labrico: "ラブリコ 2×4アジャスター",
  diawall: "ディアウォール 2×4",
  wallist: "ウォリスト 2×4アジャスター",
};

/** Board pricing: { basePriceMm, priceYen } */
const BOARD_PRICING: Record<ShelfBoardType, { baseLengthMm: number; priceYen: number }> = {
  "spf-2x4": { baseLengthMm: 1820, priceYen: 600 },
  "spf-1x4": { baseLengthMm: 1820, priceYen: 300 },
  "pine-18": { baseLengthMm: 900, priceYen: 1200 },
  "pine-25": { baseLengthMm: 900, priceYen: 1800 },
  "plywood-12": { baseLengthMm: 1800, priceYen: 1500 },
  "melamine-16": { baseLengthMm: 900, priceYen: 1600 },
};

/** Board display names */
const BOARD_NAME: Record<ShelfBoardType, string> = {
  "spf-2x4": "SPF 2×4材",
  "spf-1x4": "SPF 1×4材",
  "pine-18": "パイン集成材 18mm",
  "pine-25": "パイン集成材 25mm",
  "plywood-12": "合板 12mm",
  "melamine-16": "メラミン化粧板 16mm",
};

/** Required tools list */
const REQUIRED_TOOLS: { name: string; price: number; keyword: string }[] = [
  { name: "メジャー", price: 500, keyword: "メジャー 5m DIY" },
  { name: "電動ドライバー", price: 4000, keyword: "電動ドライバー DIY 初心者" },
  { name: "水平器", price: 800, keyword: "水平器 DIY" },
  { name: "鉛筆・差し金", price: 600, keyword: "差し金 DIY" },
];

/**
 * Determine the number of vertical pillars required.
 *   width ≤ 90cm  → 2 pillars
 *   width ≤ 180cm → 3 pillars
 */
function determinePillarCount(widthCm: number): number {
  if (widthCm <= 90) return 2;
  if (widthCm <= 180) return 3;
  return Math.ceil(widthCm / 90) + 1;
}

/**
 * Calculate shelf board unit price scaled by actual width.
 */
function calcBoardPrice(boardType: ShelfBoardType, widthMm: number): number {
  const { baseLengthMm, priceYen } = BOARD_PRICING[boardType];
  return Math.ceil((widthMm / baseLengthMm) * priceYen);
}

export function calculateMaterials(input: MaterialCalcInput): MaterialCalcResult {
  const { widthCm, heightCm, shelfCount, boardType, mountType } = input;

  const pillarCount = determinePillarCount(widthCm);
  const pillarLengthMm = heightCm * 10;
  const shelfWidthMm = widthCm * 10;

  const items: MaterialCalcItem[] = [];

  // --- Pillar lumber (always 2×4 for wall-mount types) ---
  const pillarBoardType =
    mountType === "freestanding" ? boardType : "spf-2x4";
  const pillarPricing = BOARD_PRICING[pillarBoardType === "spf-2x4" ? "spf-2x4" : pillarBoardType];
  const pillarUnitPrice = Math.ceil(
    (pillarLengthMm / pillarPricing.baseLengthMm) * pillarPricing.priceYen,
  );

  items.push({
    category: "lumber",
    name: "柱用 SPF 2×4材",
    spec: `${pillarLengthMm}mm`,
    quantity: pillarCount,
    unitPrice: pillarUnitPrice,
    subtotal: pillarUnitPrice * pillarCount,
    amazonKeyword: "SPF 2×4 木材",
  });

  // --- Adjusters (wall-mount types only) ---
  if (mountType !== "freestanding") {
    const adjusterPrice = ADJUSTER_PRICE[mountType];
    const adjusterName = ADJUSTER_NAME[mountType];

    items.push({
      category: "hardware",
      name: adjusterName,
      spec: "2×4用",
      quantity: pillarCount,
      unitPrice: adjusterPrice,
      subtotal: adjusterPrice * pillarCount,
      amazonKeyword: adjusterName,
    });
  }

  // --- Shelf boards ---
  const boardUnitPrice = calcBoardPrice(boardType, shelfWidthMm);
  const boardName = BOARD_NAME[boardType];

  items.push({
    category: "lumber",
    name: `棚板 ${boardName}`,
    spec: `${shelfWidthMm}mm × ${input.depthCm * 10}mm`,
    quantity: shelfCount,
    unitPrice: boardUnitPrice,
    subtotal: boardUnitPrice * shelfCount,
    amazonKeyword: boardName,
  });

  // --- L-brackets (2 per shelf) ---
  const bracketCount = 2 * shelfCount;
  const bracketUnitPrice = 200;

  items.push({
    category: "hardware",
    name: "L字金具",
    spec: "棚受け用",
    quantity: bracketCount,
    unitPrice: bracketUnitPrice,
    subtotal: bracketUnitPrice * bracketCount,
    amazonKeyword: "L字金具 棚受け",
  });

  // --- Screws (1 box shared) ---
  items.push({
    category: "hardware",
    name: "木ねじセット",
    spec: "50本入り",
    quantity: 1,
    unitPrice: 500,
    subtotal: 500,
    amazonKeyword: "木ねじ 50本 DIY",
  });

  // --- Required tools ---
  for (const tool of REQUIRED_TOOLS) {
    items.push({
      category: "tool",
      name: tool.name,
      spec: "",
      quantity: 1,
      unitPrice: tool.price,
      subtotal: tool.price,
      amazonKeyword: tool.keyword,
    });
  }

  const totalCost = items.reduce((sum, item) => sum + item.subtotal, 0);

  return {
    items,
    totalCost,
    pillarCount,
    pillarLengthMm,
    shelfWidthMm,
  };
}

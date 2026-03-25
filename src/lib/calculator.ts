import type {
  DesignInput,
  DesignResult,
  PartItem,
  AdjusterProduct,
  LumberSpec,
  ShelfBoard,
} from "@/types";
import {
  ADJUSTERS,
  LUMBER_SPECS,
  SHELF_BOARDS,
  BRACKETS,
  buildAmazonUrl,
} from "@/data/products";

/**
 * 柱の木材カット寸法を計算する
 * カット長 = 天井高（or ユニット高さ） − アジャスター補正値
 */
export function calcPillarLength(
  heightMm: number,
  adjuster: AdjusterProduct,
  fullHeight: boolean
): number {
  if (!fullHeight) return heightMm; // 自立型はそのまま
  return heightMm - adjuster.cutOffset;
}

/**
 * 棚間隔が指定されていない場合の均等割り
 */
export function calcDefaultSpacings(
  totalHeightMm: number,
  shelfCount: number
): number[] {
  const usableHeight = totalHeightMm - 50;
  const sections = shelfCount + 1;
  const baseSpacing = Math.floor(usableHeight / sections);
  const remainder = usableHeight - baseSpacing * sections;

  const spacings: number[] = [];
  for (let i = 0; i < sections; i++) {
    let spacing = baseSpacing;
    if (i === 0) spacing += Math.floor(remainder / 2) + 30;
    if (i === sections - 1) spacing += Math.ceil(remainder / 2) - 30;
    spacings.push(Math.max(spacing, 100));
  }
  return spacings;
}

/**
 * 木材サイズ選定 (6ft / 8ft / 10ft)
 */
function selectLumberSize(lengthMm: number): {
  standardName: string;
  standardLength: number;
  priceMultiplier: number;
} {
  if (lengthMm <= 1820) {
    return { standardName: "6フィート (1820mm)", standardLength: 1820, priceMultiplier: 1.0 };
  } else if (lengthMm <= 2438) {
    return { standardName: "8フィート (2438mm)", standardLength: 2438, priceMultiplier: 1.4 };
  } else {
    return { standardName: "10フィート (3050mm)", standardLength: 3050, priceMultiplier: 1.8 };
  }
}

/**
 * アジャスターキーを解決する
 * pillarLumber が 1x4 の場合は _1x4 バリアントを探す
 */
function resolveAdjuster(
  adjusterKey: string,
  pillarLumber: string
): AdjusterProduct {
  if (pillarLumber === "1x4") {
    const variant = ADJUSTERS[`${adjusterKey}_1x4`];
    if (variant) return variant;
  }
  return ADJUSTERS[adjusterKey] ?? ADJUSTERS["labrico"];
}

/**
 * 棚板を解決する
 */
function resolveShelfBoard(materialId: string): ShelfBoard {
  return SHELF_BOARDS.find((b) => b.id === materialId) ?? SHELF_BOARDS[0];
}

/**
 * メインの設計計算
 */
export function calculateDesign(input: DesignInput): DesignResult {
  const adjuster = resolveAdjuster(input.adjuster, input.pillarLumber);
  const lumberSpec =
    LUMBER_SPECS[input.pillarLumber] ?? LUMBER_SPECS["2x4"];
  const shelfBoard = resolveShelfBoard(input.shelfMaterial);

  // 1. 柱カット長
  const effectiveHeight = input.fullHeight
    ? input.ceilingHeight
    : input.unitHeight ?? 1200;
  const pillarLength = calcPillarLength(effectiveHeight, adjuster, input.fullHeight);

  // 2. 棚間隔 → 棚高さ
  const spacings =
    input.shelfSpacings && input.shelfSpacings.length === input.shelfCount + 1
      ? input.shelfSpacings
      : calcDefaultSpacings(
          input.fullHeight ? input.ceilingHeight : (input.unitHeight ?? 1200),
          input.shelfCount
        );

  const shelfHeights: number[] = [];
  let cumulative = 0;
  for (let i = 0; i < input.shelfCount; i++) {
    cumulative += spacings[i];
    shelfHeights.push(cumulative);
  }

  // 3. 木材サイズ選定
  const lumberSize = selectLumberSize(pillarLength);

  // 4. 棚受け金具の選定
  const bracket = input.pillarLumber === "1x4" ? BRACKETS[0] : BRACKETS[1];

  // ── 部材リスト生成 ──
  const parts: PartItem[] = [];

  // アジャスター (自立型でなければ)
  if (input.fullHeight) {
    parts.push({
      category: "adjuster",
      name: `${adjuster.name} (${adjuster.nameEn})`,
      quantity: input.pillarCount,
      unitPrice: adjuster.priceYen,
      subtotal: adjuster.priceYen * input.pillarCount,
      amazonUrl: buildAmazonUrl(adjuster.amazonKeyword),
      note: `天井高から−${adjuster.cutOffset}mmでカット`,
    });
  }

  // 柱用木材
  const pillarUnitPrice = Math.round(
    lumberSpec.pricePerUnit * lumberSize.priceMultiplier
  );

  // コーナーの場合、柱配置の説明を追加
  const pillarNote =
    input.layout === "corner"
      ? `${pillarLength}mmにカット。L字コーナー配置 (角に1本 + 各辺1本)`
      : `${pillarLength}mmにカット (${input.fullHeight ? `天井高${input.ceilingHeight}mm − ${adjuster.cutOffset}mm` : `高さ${input.unitHeight}mm`})`;

  parts.push({
    category: "lumber",
    name: `${lumberSpec.name} ${lumberSize.standardName}【柱用】`,
    quantity: input.pillarCount,
    unitPrice: pillarUnitPrice,
    subtotal: pillarUnitPrice * input.pillarCount,
    amazonUrl: buildAmazonUrl(lumberSpec.amazonKeyword),
    note: pillarNote,
  });

  // 棚板 (棚板0枚 or 柱1本の場合はスキップ)
  const spanCount = input.layout === "corner" ? 2 : Math.max(input.pillarCount - 1, 1);
  const shelfDepth =
    shelfBoard.fixedDepthMm > 0 ? shelfBoard.fixedDepthMm : input.shelfDepth;

  /** 各棚板の幅を取得（個別設定 or デフォルト） */
  const getShelfWidth = (idx: number) =>
    input.shelfWidths?.[idx] ?? input.shelfWidth;

  if (input.shelfCount === 0 || input.pillarCount < 2) {
    // 棚板なし（壁掛け用途など）— skip
  } else if (shelfBoard.id === "2x4-shelf" || shelfBoard.id === "1x4-shelf") {
    // ツーバイ系: 棚板1枚につき幅方向に並べる本数
    const boardWidth =
      LUMBER_SPECS[shelfBoard.id === "2x4-shelf" ? "2x4" : "1x4"]?.widthMm ?? 89;
    const boardsPerShelf = Math.max(
      1,
      Math.ceil(input.shelfDepth / boardWidth)
    );
    const shelfUnitPrice = shelfBoard.pricePerUnit; // 1本の価格
    const shelfQuantity = input.shelfCount * boardsPerShelf;

    // 個別幅の有無を表示
    const hasCustomWidths = input.shelfWidths?.some((w, i) => i < input.shelfCount && w !== input.shelfWidth);
    const widthNote = hasCustomWidths
      ? `各棚板の幅は個別設定あり`
      : `幅${input.shelfWidth}mmにカット`;

    parts.push({
      category: "shelf",
      name: `${shelfBoard.name}【棚板用】`,
      quantity: shelfQuantity * spanCount,
      unitPrice: shelfUnitPrice,
      subtotal: shelfUnitPrice * shelfQuantity * spanCount,
      amazonUrl: buildAmazonUrl(shelfBoard.amazonKeyword),
      note: `棚板${input.shelfCount}枚 × ${boardsPerShelf}本並べ × ${spanCount}スパン (${widthNote})`,
    });
  } else {
    // 集成材系: 各棚板の幅で価格調整し合計
    let shelfSubtotal = 0;
    for (let i = 0; i < input.shelfCount; i++) {
      const w = getShelfWidth(i);
      const priceAdjust = (w / 600) * (shelfDepth / 250);
      shelfSubtotal += Math.round(shelfBoard.pricePerUnit * priceAdjust);
    }
    shelfSubtotal *= spanCount;

    const hasCustomWidths = input.shelfWidths?.some((w, i) => i < input.shelfCount && w !== input.shelfWidth);
    const widthNote = hasCustomWidths
      ? `各棚板の幅は個別設定あり`
      : `幅${input.shelfWidth}mm`;

    parts.push({
      category: "shelf",
      name: `${shelfBoard.name} (${widthNote}×${shelfDepth}mm)【棚板用】`,
      quantity: input.shelfCount * spanCount,
      unitPrice: Math.round(shelfSubtotal / (input.shelfCount * spanCount)),
      subtotal: shelfSubtotal,
      amazonUrl: buildAmazonUrl(
        `${shelfBoard.amazonKeyword} ${input.shelfWidth}mm`
      ),
      note: `${widthNote} × 奥行${shelfDepth}mm × 厚さ${shelfBoard.thicknessMm}mm`,
    });
  }

  // 棚受け金具 (棚板がある場合のみ)
  if (input.shelfCount > 0 && input.pillarCount >= 2) {
    const bracketSets = input.shelfCount * spanCount;
    parts.push({
      category: "bracket",
      name: bracket.name,
      quantity: bracketSets,
      unitPrice: bracket.pricePerPair,
      subtotal: bracket.pricePerPair * bracketSets,
      amazonUrl: buildAmazonUrl(bracket.amazonKeyword),
      note: `棚板${input.shelfCount}枚 × ${spanCount}スパン = ${bracketSets}組`,
    });

    // ネジ
    const screwCount = Math.ceil(bracketSets * 4 * 1.2);
    parts.push({
      category: "screw",
      name: "木ネジセット (3.8×32mm)",
      quantity: 1,
      unitPrice: 400,
      subtotal: 400,
      amazonUrl: buildAmazonUrl("木ネジ 3.8×32 ステンレス"),
      note: `約${screwCount}本使用 (金具固定用)`,
    });
  }

  const totalEstimate = parts.reduce((sum, p) => sum + p.subtotal, 0);

  return {
    pillarLength,
    lumberSpec,
    adjuster,
    partsList: parts,
    totalEstimate,
    shelfHeights,
    shelfBoard,
  };
}

import { WOOD_PROPERTY_MAP } from "@/data/wood-properties";

export interface StrengthInput {
  woodType: string;
  spanMm: number;
  thicknessMm: number;
  depthMm: number;
  loadKg: number;
  supportType: "both-ends" | "cantilever" | "three-point";
}

export interface StrengthResult {
  deflectionMm: number;
  safetyRating: "safe" | "caution" | "danger";
  safetyLabel: string;
  maxRecommendedLoadKg: number;
  suggestions: string[];
}

/**
 * Calculate the moment of inertia for a rectangular cross-section.
 * I = (b × h³) / 12
 * where b = depth (mm), h = thickness (mm)
 */
function momentOfInertia(depthMm: number, thicknessMm: number): number {
  return (depthMm * Math.pow(thicknessMm, 3)) / 12;
}

/**
 * Calculate beam deflection based on support type.
 *
 * Simply-supported (both-ends): δ = (5 × W × L⁴) / (384 × E × I)
 * Cantilever:                   δ = (W × L⁴) / (8 × E × I)
 * Three-point (center support): δ = (W × L⁴) / (768 × E × I)
 */
function calcDeflection(
  loadN: number,
  spanMm: number,
  youngsModulusMPa: number,
  inertia: number,
  supportType: StrengthInput["supportType"],
): number {
  const W = loadN;
  const L4 = Math.pow(spanMm, 4);
  const EI = youngsModulusMPa * inertia;

  switch (supportType) {
    case "cantilever":
      return (W * L4) / (8 * EI);
    case "three-point":
      return (W * L4) / (768 * EI);
    case "both-ends":
    default:
      return (5 * W * L4) / (384 * EI);
  }
}

/**
 * Determine safety rating based on deflection vs span length.
 *   safe:    deflection < span / 300
 *   caution: deflection < span / 150
 *   danger:  deflection >= span / 150
 */
function evaluateSafety(
  deflectionMm: number,
  spanMm: number,
): { rating: StrengthResult["safetyRating"]; label: string } {
  if (deflectionMm < spanMm / 300) {
    return { rating: "safe", label: "◎ 安全" };
  }
  if (deflectionMm < spanMm / 150) {
    return { rating: "caution", label: "△ 注意" };
  }
  return { rating: "danger", label: "× 危険" };
}

/**
 * Back-calculate the maximum load (kg) that keeps deflection within the
 * "safe" threshold (span / 300).
 */
function calcMaxSafeLoadKg(
  spanMm: number,
  youngsModulusMPa: number,
  inertia: number,
  supportType: StrengthInput["supportType"],
): number {
  const maxDeflection = spanMm / 300;
  const EI = youngsModulusMPa * inertia;
  let maxLoadN: number;

  switch (supportType) {
    case "cantilever":
      maxLoadN = (maxDeflection * 8 * EI) / Math.pow(spanMm, 4);
      break;
    case "three-point":
      maxLoadN = (maxDeflection * 768 * EI) / Math.pow(spanMm, 4);
      break;
    case "both-ends":
    default:
      maxLoadN = (maxDeflection * 384 * EI) / (5 * Math.pow(spanMm, 4));
      break;
  }

  return Math.round((maxLoadN / 9.8) * 10) / 10;
}

/**
 * Generate improvement suggestions based on the analysis.
 */
function buildSuggestions(
  safetyRating: StrengthResult["safetyRating"],
  input: StrengthInput,
): string[] {
  const suggestions: string[] = [];

  if (safetyRating === "safe") {
    return suggestions;
  }

  if (input.thicknessMm < 25) {
    suggestions.push("板の厚みを増やすと、たわみを大幅に減らせます（厚み2倍で剛性8倍）");
  }

  if (input.spanMm > 600 && input.supportType === "both-ends") {
    suggestions.push("中間に支柱を追加して三点支持にすると、たわみを大きく軽減できます");
  }

  if (input.supportType === "cantilever" && input.spanMm > 300) {
    suggestions.push("片持ち支持はたわみが大きくなります。両端支持への変更を検討してください");
  }

  if (input.depthMm < 150) {
    suggestions.push("奥行きを広くすると断面性能が向上します");
  }

  suggestions.push("荷重を分散させるか、棚板の枚数を増やして1枚あたりの荷重を減らしてください");

  return suggestions;
}

export function calculateStrength(input: StrengthInput): StrengthResult {
  const woodProps = WOOD_PROPERTY_MAP.get(input.woodType);

  if (!woodProps) {
    throw new Error(`Unknown wood type: ${input.woodType}`);
  }

  const E = woodProps.youngsModulusMPa;
  const I = momentOfInertia(input.depthMm, input.thicknessMm);
  const loadN = input.loadKg * 9.8;

  const deflectionMm =
    Math.round(calcDeflection(loadN, input.spanMm, E, I, input.supportType) * 100) / 100;

  const { rating, label } = evaluateSafety(deflectionMm, input.spanMm);

  const maxRecommendedLoadKg = calcMaxSafeLoadKg(
    input.spanMm,
    E,
    I,
    input.supportType,
  );

  const suggestions = buildSuggestions(rating, input);

  return {
    deflectionMm,
    safetyRating: rating,
    safetyLabel: label,
    maxRecommendedLoadKg,
    suggestions,
  };
}

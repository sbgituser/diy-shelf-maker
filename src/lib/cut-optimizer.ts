/**
 * cut-optimizer.ts
 *
 * 定尺材(木材バー)から複数の部材を切り出す際の購入本数・カット割付を最適化する。
 * 1次元カッティングストック問題として扱い、First-Fit Decreasing + 複数試行の
 * ヒューリスティックで解く(部材点数が数十点程度のDIY用途では十分な精度)。
 *
 * 参考: https://www.creativity-ape.com/entry/2019/05/28/204818
 *   （ビンパッキングによる木材カット最適化の考え方）
 */

/** 最適化対象の1部材(カットする1本の長さ) */
export interface CutPiece {
  lengthMm: number;
  /** 表示用ラベル(例: "棚板1"）。省略可 */
  label?: string;
}

/** 種類ごとの部材(同じ長さがquantity本必要、という表現) */
export interface CutPieceGroup {
  lengthMm: number;
  quantity: number;
  label?: string;
}

/** 1本のバーへの割付結果 */
export interface BarLayout {
  barIndex: number;
  cuts: CutPiece[];
  wasteMm: number;
}

/** 最適化結果 */
export interface CutPlan {
  barLengthMm: number;
  barsNeeded: number;
  layouts: BarLayout[];
  totalCutCount: number;
  totalWasteMm: number;
  materialCost: number;
  cutCost: number;
  totalCost: number;
}

export interface CutOptimizerOptions {
  /** 刃幅(mm)。カットのたびに失われる長さ */
  kerfMm?: number;
  /** カット1回あたりの加工費(円) */
  cutFeePerCut?: number;
  /** ランダム試行回数(多いほど精度が上がるが計算時間が増える) */
  trials?: number;
  /** 定尺材1本あたりの価格(円)。合計コスト算出に使う。省略時は0 */
  barPriceYen?: number;
}

const DEFAULT_KERF_MM = 3;
const DEFAULT_CUT_FEE = 50;
const DEFAULT_TRIALS = 30;

function expandGroups(groups: CutPieceGroup[]): CutPiece[] {
  const pieces: CutPiece[] = [];
  for (const g of groups) {
    for (let i = 0; i < g.quantity; i++) {
      pieces.push({ lengthMm: g.lengthMm, label: g.label });
    }
  }
  return pieces;
}

/** 配列をFisher-Yatesでシャッフル(元配列は変更しない) */
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * First-Fit: 与えられた順序で、各部材を「入る最初のバー」に詰める。
 * 入らなければ新しいバーを開く。
 */
function firstFit(pieces: CutPiece[], barLengthMm: number, kerfMm: number): BarLayout[] {
  const bars: { remaining: number; cuts: CutPiece[] }[] = [];

  for (const piece of pieces) {
    const needed = piece.lengthMm + kerfMm;
    if (needed > barLengthMm) {
      // 定尺材1本に収まらない部材はスキップ(呼び出し側でチェック済み想定)
      continue;
    }
    const bar = bars.find((b) => b.remaining >= needed);
    if (bar) {
      bar.remaining -= needed;
      bar.cuts.push(piece);
    } else {
      bars.push({ remaining: barLengthMm - needed, cuts: [piece] });
    }
  }

  return bars.map((b, i) => ({
    barIndex: i + 1,
    cuts: b.cuts,
    wasteMm: Math.max(0, b.remaining),
  }));
}

function evaluateCost(
  layouts: BarLayout[],
  opts: Required<Pick<CutOptimizerOptions, "cutFeePerCut" | "barPriceYen">>,
): { totalCutCount: number; materialCost: number; cutCost: number; totalCost: number } {
  const totalCutCount = layouts.reduce((sum, l) => sum + l.cuts.length, 0);
  const materialCost = layouts.length * opts.barPriceYen;
  const cutCost = totalCutCount * opts.cutFeePerCut;
  return { totalCutCount, materialCost, cutCost, totalCost: materialCost + cutCost };
}

/**
 * 指定した定尺材の長さで、部材グループを最適に割り付ける。
 * 部材の並び順を複数パターン試行し、総コストが最小の結果を返す。
 */
export function optimizeCutPlan(
  groups: CutPieceGroup[],
  barLengthMm: number,
  options: CutOptimizerOptions = {},
): CutPlan {
  const kerfMm = options.kerfMm ?? DEFAULT_KERF_MM;
  const cutFeePerCut = options.cutFeePerCut ?? DEFAULT_CUT_FEE;
  const barPriceYen = options.barPriceYen ?? 0;
  const trials = options.trials ?? DEFAULT_TRIALS;

  const allPieces = expandGroups(groups);
  const fittablePieces = allPieces.filter((p) => p.lengthMm + kerfMm <= barLengthMm);

  if (fittablePieces.length === 0) {
    return {
      barLengthMm,
      barsNeeded: 0,
      layouts: [],
      totalCutCount: 0,
      totalWasteMm: 0,
      materialCost: 0,
      cutCost: 0,
      totalCost: 0,
    };
  }

  // 試行1: 長さ降順(First-Fit Decreasing。単体でも良好な結果が出やすい)
  const descending = [...fittablePieces].sort((a, b) => b.lengthMm - a.lengthMm);
  let best = firstFit(descending, barLengthMm, kerfMm);
  let bestCost = evaluateCost(best, { cutFeePerCut, barPriceYen }).totalCost;

  // 試行2以降: 降順をベースにランダムシャッフルして探索
  for (let t = 0; t < trials; t++) {
    const candidateOrder = shuffle(descending);
    const candidate = firstFit(candidateOrder, barLengthMm, kerfMm);
    const cost = evaluateCost(candidate, { cutFeePerCut, barPriceYen }).totalCost;
    if (
      cost < bestCost ||
      (cost === bestCost && candidate.length < best.length)
    ) {
      best = candidate;
      bestCost = cost;
    }
  }

  const { totalCutCount, materialCost, cutCost, totalCost } = evaluateCost(best, {
    cutFeePerCut,
    barPriceYen,
  });
  const totalWasteMm = best.reduce((sum, l) => sum + l.wasteMm, 0);

  return {
    barLengthMm,
    barsNeeded: best.length,
    layouts: best,
    totalCutCount,
    totalWasteMm,
    materialCost,
    cutCost,
    totalCost,
  };
}

/**
 * 複数の定尺材候補の中から、総コストが最小になる長さを自動選択する。
 */
export function optimizeCutPlanAcrossLengths(
  groups: CutPieceGroup[],
  barLengthCandidates: number[],
  options: CutOptimizerOptions = {},
): CutPlan {
  const plans = barLengthCandidates
    .map((len) => optimizeCutPlan(groups, len, options))
    .filter((p) => p.barsNeeded > 0);

  if (plans.length === 0) {
    return optimizeCutPlan(groups, barLengthCandidates[0] ?? 0, options);
  }

  return plans.reduce((bestPlan, p) => (p.totalCost < bestPlan.totalCost ? p : bestPlan));
}

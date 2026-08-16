/**
 * cut-optimizer.ts
 *
 * 定尺材(木材バー)から複数の部材を切り出す際の購入本数・カット割付を最適化する。
 * 1次元カッティングストック問題として扱い、First-Fit Decreasing + 複数試行の
 * ヒューリスティックで解く(部材点数が数十点程度のDIY用途では十分な精度)。
 *
 * 定尺材の長さは6ft/8ft/10ft/12ftのように複数候補があり、長い部材は長い定尺材、
 * 短い部材は安い短めの定尺材、というように「候補ごとに使い分ける」方が
 * 単一の長さに揃えるより総コストが安くなることが多い。そのため
 * optimizeMixedCutPlan() は1回の最適化の中で複数の定尺材長を混在させる。
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

/** 定尺材の候補(長さと単価) */
export interface StockCandidate {
  lengthMm: number;
  barPriceYen: number;
  /**
   * 取扱店が限られるなど、積極的には使いたくない定尺材の場合はtrue。
   * この候補は「単体の部材の長さがこれより短い候補には収まらない」
   * 場合にのみ採用され、複数の短い部材をまとめるためだけには使われない。
   */
  limitedAvailability?: boolean;
}

/** 1本のバーへの割付結果 */
export interface BarLayout {
  barIndex: number;
  /** このバーに使った定尺材の長さ(mm) */
  barLengthMm: number;
  cuts: CutPiece[];
  wasteMm: number;
}

/** 最適化結果 */
export interface CutPlan {
  barsNeeded: number;
  layouts: BarLayout[];
  totalCutCount: number;
  totalWasteMm: number;
  materialCost: number;
  cutCost: number;
  totalCost: number;
  /** 定尺材の長さ(mm) → 購入本数。複数長さが混在する場合の内訳 */
  barsByLength: Record<number, number>;
  /** どの候補にも収まらず、カットできなかった部材(想定外の長さがあれば入る) */
  unfitPieces: CutPiece[];
}

export interface CutOptimizerOptions {
  /** 刃幅(mm)。カットのたびに失われる長さ */
  kerfMm?: number;
  /** カット1回あたりの加工費(円) */
  cutFeePerCut?: number;
  /** ランダム試行回数(多いほど精度が上がるが計算時間が増える) */
  trials?: number;
}

const DEFAULT_KERF_MM = 3;
const DEFAULT_CUT_FEE = 50;
const DEFAULT_TRIALS = 40;

const EMPTY_PLAN: CutPlan = {
  barsNeeded: 0,
  layouts: [],
  totalCutCount: 0,
  totalWasteMm: 0,
  materialCost: 0,
  cutCost: 0,
  totalCost: 0,
  barsByLength: {},
  unfitPieces: [],
};

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

type OpenBar = { lengthMm: number; barPriceYen: number; remaining: number; cuts: CutPiece[] };

/**
 * 与えられた順序で各部材を詰める。
 * - 既存バーに入るものがあれば、最も無駄が出ないバー(Best-Fit)に入れる
 * - 入らなければ、その部材が収まる候補の中で最も安い定尺材で新しいバーを開く
 * 複数の定尺材長を候補として渡すことで、長い部材には長い(高い)バーを、
 * 短い部材には安いバーを、と自然に使い分けた結果になる。
 */
function packMixed(
  pieces: CutPiece[],
  candidates: StockCandidate[],
  kerfMm: number,
): { bars: OpenBar[]; unfit: CutPiece[] } {
  const sortedAll = [...candidates].sort((a, b) => a.barPriceYen - b.barPriceYen);
  const sortedNonLimited = sortedAll.filter((c) => !c.limitedAvailability);
  const bars: OpenBar[] = [];
  const unfit: CutPiece[] = [];

  for (const piece of pieces) {
    const needed = piece.lengthMm + kerfMm;

    let bestBar: OpenBar | null = null;
    for (const bar of bars) {
      if (bar.remaining >= needed && (!bestBar || bar.remaining < bestBar.remaining)) {
        bestBar = bar;
      }
    }
    if (bestBar) {
      bestBar.remaining -= needed;
      bestBar.cuts.push(piece);
      continue;
    }

    // まず取扱いやすい(limitedAvailabilityでない)候補から探す。
    // その部材単体がどれにも収まらない場合のみ、取扱いの限られる候補を許可する
    const candidate =
      sortedNonLimited.find((c) => needed <= c.lengthMm) ?? sortedAll.find((c) => needed <= c.lengthMm);
    if (!candidate) {
      unfit.push(piece);
      continue;
    }
    bars.push({
      lengthMm: candidate.lengthMm,
      barPriceYen: candidate.barPriceYen,
      remaining: candidate.lengthMm - needed,
      cuts: [piece],
    });
  }

  return { bars, unfit };
}

/**
 * バーの統合による改善を探す後処理。
 *
 * packMixed()は「新しいバーを開く瞬間、その1部材だけを見て最も安い候補を
 * 選ぶ」貪欲法のため、例えば600mm材が3本収まる6ft材(端材少)と、
 * 4本目だけが乗った別の6ft材(端材大)、という組み合わせを作ってしまうことが
 * ある。本来は4本まとめて8ft材1本にする方が安い場合でも、貪欲法単体では
 * 見つけられない。
 *
 * ここでは総当たりで2本のバーの組み合わせを調べ、その中身を1本の
 * (現状より安い、または同額で本数が減る)定尺材にまとめられるなら統合する。
 * 改善が見つからなくなるまで繰り返す。
 */
function consolidateBars(bars: OpenBar[], candidates: StockCandidate[], kerfMm: number): OpenBar[] {
  const sortedAll = [...candidates].sort((a, b) => a.barPriceYen - b.barPriceYen);
  const sortedNonLimited = sortedAll.filter((c) => !c.limitedAvailability);
  const maxNonLimitedLength =
    sortedNonLimited.length > 0 ? Math.max(...sortedNonLimited.map((c) => c.lengthMm)) : 0;
  let current = [...bars];

  let improved = true;
  while (improved) {
    improved = false;
    for (let i = 0; i < current.length && !improved; i++) {
      for (let j = i + 1; j < current.length && !improved; j++) {
        const combinedCuts = [...current[i].cuts, ...current[j].cuts];
        const neededLength = combinedCuts.reduce((sum, c) => sum + c.lengthMm + kerfMm, 0);
        const currentCost = current[i].barPriceYen + current[j].barPriceYen;

        // 統合後のバーに、単体で取扱いやすい候補の最大長を超える部材が
        // 含まれる場合のみ、取扱いの限られる候補での統合を許可する
        // (短い部材同士をまとめるためだけに10ft材等を持ち出さない)
        const requiresLimited = combinedCuts.some((c) => c.lengthMm + kerfMm > maxNonLimitedLength);
        const searchPool = requiresLimited ? sortedAll : sortedNonLimited;

        const candidate = searchPool.find(
          (c) => neededLength <= c.lengthMm && c.barPriceYen < currentCost,
        );
        if (!candidate) continue;

        const merged: OpenBar = {
          lengthMm: candidate.lengthMm,
          barPriceYen: candidate.barPriceYen,
          remaining: candidate.lengthMm - neededLength,
          cuts: combinedCuts,
        };
        current = [...current.filter((_, idx) => idx !== i && idx !== j), merged];
        improved = true;
      }
    }
  }

  return current;
}

function toLayouts(bars: OpenBar[]): BarLayout[] {
  return bars.map((b, i) => ({
    barIndex: i + 1,
    barLengthMm: b.lengthMm,
    cuts: b.cuts,
    wasteMm: Math.max(0, b.remaining),
  }));
}

function evaluateCost(
  bars: OpenBar[],
  cutFeePerCut: number,
): { totalCutCount: number; materialCost: number; cutCost: number; totalCost: number } {
  const totalCutCount = bars.reduce((sum, b) => sum + b.cuts.length, 0);
  const materialCost = bars.reduce((sum, b) => sum + b.barPriceYen, 0);
  const cutCost = totalCutCount * cutFeePerCut;
  return { totalCutCount, materialCost, cutCost, totalCost: materialCost + cutCost };
}

function buildPlan(bars: OpenBar[], unfit: CutPiece[], cutFeePerCut: number): CutPlan {
  const { totalCutCount, materialCost, cutCost, totalCost } = evaluateCost(bars, cutFeePerCut);
  const totalWasteMm = bars.reduce((sum, b) => sum + Math.max(0, b.remaining), 0);
  const barsByLength: Record<number, number> = {};
  for (const b of bars) barsByLength[b.lengthMm] = (barsByLength[b.lengthMm] ?? 0) + 1;

  return {
    barsNeeded: bars.length,
    layouts: toLayouts(bars),
    totalCutCount,
    totalWasteMm,
    materialCost,
    cutCost,
    totalCost,
    barsByLength,
    unfitPieces: unfit,
  };
}

/**
 * 複数の定尺材長さを組み合わせて、部材グループを最適に割り付ける。
 * (例: 長い柱は8ftバー、短い棚板は6ftバー、というように使い分けられる)
 * 部材の並び順を複数パターン試行し、総コストが最小の結果を返す。
 *
 * 1本でも部材がどの候補にも収まらない場合は plan.unfitPieces に入る
 * (呼び出し側で必ずチェックすること。黙って購入計画から消してはいけない)。
 */
export function optimizeMixedCutPlan(
  groups: CutPieceGroup[],
  candidates: StockCandidate[],
  options: CutOptimizerOptions = {},
): CutPlan {
  const kerfMm = options.kerfMm ?? DEFAULT_KERF_MM;
  const cutFeePerCut = options.cutFeePerCut ?? DEFAULT_CUT_FEE;
  const trials = options.trials ?? DEFAULT_TRIALS;

  const allPieces = expandGroups(groups);
  if (allPieces.length === 0 || candidates.length === 0) return EMPTY_PLAN;

  const descending = [...allPieces].sort((a, b) => b.lengthMm - a.lengthMm);

  const first = packMixed(descending, candidates, kerfMm);
  let best = first.bars;
  let bestUnfit = first.unfit;
  let bestCost = evaluateCost(best, cutFeePerCut).totalCost;

  for (let t = 0; t < trials; t++) {
    const order = shuffle(descending);
    const { bars, unfit } = packMixed(order, candidates, kerfMm);
    // 収まらない部材が少ない案を優先し、同数ならコストで比較する
    if (unfit.length > bestUnfit.length) continue;
    const cost = evaluateCost(bars, cutFeePerCut).totalCost;
    if (unfit.length < bestUnfit.length || cost < bestCost) {
      best = bars;
      bestUnfit = unfit;
      bestCost = cost;
    }
  }

  // 貪欲法の結果に対し、バー統合でさらに安くならないか後処理で確認する
  best = consolidateBars(best, candidates, kerfMm);

  return buildPlan(best, bestUnfit, cutFeePerCut);
}

/**
 * 単一の定尺材長さのみで割り付ける(混在させたくない場合向け)。
 */
export function optimizeCutPlan(
  groups: CutPieceGroup[],
  barLengthMm: number,
  barPriceYen: number,
  options: CutOptimizerOptions = {},
): CutPlan {
  return optimizeMixedCutPlan(groups, [{ lengthMm: barLengthMm, barPriceYen }], options);
}

/**
 * カット割付を「No.：1【8ft】部材計：1280mm 内訳：[1280] 端材：537mm」形式の
 * 行リストに整形する。ホームセンターへの持参用メモとして使う想定。
 */
export function formatCutPlanLines(plan: CutPlan): string[] {
  return plan.layouts.map((l) => {
    const partsSum = l.cuts.reduce((sum, c) => sum + c.lengthMm, 0);
    const breakdown = l.cuts.map((c) => c.lengthMm).join(", ");
    return `No.：${l.barIndex}【${l.barLengthMm}mm材】部材計：${partsSum}mm 内訳：[${breakdown}] 端材：${l.wasteMm}mm`;
  });
}

/** 長さ別の購入本数を「8ft(2438mm)×2本、6ft(1820mm)×1本」のように整形する */
export function formatBarsByLength(
  plan: CutPlan,
  lengthLabels: Record<number, string> = {},
): string {
  return Object.entries(plan.barsByLength)
    .sort(([a], [b]) => Number(b) - Number(a))
    .map(([len, count]) => `${lengthLabels[Number(len)] ?? `${len}mm`}×${count}本`)
    .join("、");
}

/** formatCutPlanLines の結果を改行区切りの1テキストにまとめる(コピー用) */
export function formatCutPlanText(plan: CutPlan, headerLabel?: string): string {
  const summary = formatBarsByLength(plan);
  const header = headerLabel ? `【${headerLabel}】${summary}\n` : `${summary}\n`;
  return header + formatCutPlanLines(plan).join("\n");
}

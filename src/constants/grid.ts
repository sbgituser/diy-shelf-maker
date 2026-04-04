// ── GridEditor SVG定数 ──

export type Mode = "select" | "addPillar" | "addShelf";

/** mm 単位のスナップ */
export const SNAP = 50;

/** mm 描画グリッド */
export const GRID_VISUAL = 200;

/** 柱の描画幅 (px) */
export const PILLAR_PX = 16;

/** ドラッグ開始までの最小移動量 (SVG px) */
export const DRAG_THRESHOLD = 5;

/** SVG キャンバス幅 */
export const SVG_W = 800;

/** SVG キャンバス高 */
export const SVG_H = 520;

/** SVG マージン */
export const M = { top: 30, bottom: 40, left: 55, right: 25 } as const;

/** 描画領域の幅 */
export const DW = SVG_W - M.left - M.right;

/** 描画領域の高さ */
export const DH = SVG_H - M.top - M.bottom;

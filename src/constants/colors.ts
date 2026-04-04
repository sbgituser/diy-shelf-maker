// ── 共通カラーパレット ──
// GridEditor と ShelfDiagram で共有

/** GridEditor用 カラーパレット */
export const GRID_COLORS = {
  pillar: "#C4A46A",
  pillarStroke: "#8B6914",
  pillarHover: "#D4B47A",
  shelf: "#D4A76A",
  shelfStroke: "#9B7530",
  shelfHover: "#E4B77A",
  selected: "#F59E0B",
  selectedStroke: "#D97706",
  selectedGlow: "rgba(245,158,11,0.25)",
  adjuster: "#666",
  grid: "#eee",
  gridMajor: "#ddd",
  ghost: "rgba(196,164,106,0.35)",
  ghostShelf: "rgba(212,167,106,0.35)",
  bg: "#FAFAF7",
} as const;

/** ShelfDiagram用 カラーパレット */
export const DIAGRAM_COLORS = {
  pillar: "#C4A46A",
  pillarStroke: "#8B6914",
  shelf: "#D4A76A",
  shelfStroke: "#9B7530",
  shelfSelected: "#F59E0B",
  shelfSelectedStroke: "#D97706",
  adjuster: "#666",
  bracket: "#888",
  dimension: "#E74C3C",
  dimText: "#C0392B",
  line: "#888",
  bg: "#FAFAF7",
  wall: "#ddd",
} as const;

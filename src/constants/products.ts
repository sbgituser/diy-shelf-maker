// ── アジャスターブランド定数 ──

export const ADJUSTER_BRANDS = {
  labrico: "labrico",
  diawall: "diawall",
  labrico_strong: "labrico_strong",
  wallist: "wallist",
} as const;

export type AdjusterBrandKey = keyof typeof ADJUSTER_BRANDS;

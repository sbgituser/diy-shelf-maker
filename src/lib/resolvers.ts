import { ADJUSTERS } from "@/data/products";

/**
 * アジャスターキーを解決する
 * pillarLumber が 1x4 の場合は _1x4 バリアントを探す
 */
export function resolveAdjuster(key: string, lumber: string) {
  if (lumber === "1x4") {
    const variant = ADJUSTERS[`${key}_1x4`];
    if (variant) return variant;
  }
  return ADJUSTERS[key] ?? ADJUSTERS["labrico"];
}

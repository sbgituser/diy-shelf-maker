/**
 * 木材の物性値データ
 * ヤング率（弾性係数）は棚板たわみ計算に使用
 */

export interface WoodProperty {
  id: string;
  name: string;
  nameEn: string;
  /** ヤング率 (MPa) — 曲げ弾性係数 */
  youngsModulusMPa: number;
  /** 曲げ強度 (MPa) */
  bendingStrengthMPa: number;
  /** 密度 (kg/m³) */
  densityKgM3: number;
  /** 説明 */
  description: string;
}

export const WOOD_PROPERTIES: WoodProperty[] = [
  {
    id: "spf",
    name: "SPF材（ホワイトウッド）",
    nameEn: "SPF (Spruce-Pine-Fir)",
    youngsModulusMPa: 9000,
    bendingStrengthMPa: 40,
    densityKgM3: 420,
    description:
      "ホームセンターで最も手に入りやすい木材。2×4材・1×4材に使われる。加工しやすく安価だが、湿気に弱い。",
  },
  {
    id: "pine",
    name: "パイン集成材",
    nameEn: "Pine Laminated Wood",
    youngsModulusMPa: 10000,
    bendingStrengthMPa: 45,
    densityKgM3: 500,
    description:
      "パイン材を接着した集成材。反りが少なく幅広の棚板に最適。自然な木目で塗装しやすい。",
  },
  {
    id: "plywood",
    name: "合板（ラワン合板）",
    nameEn: "Plywood (Lauan)",
    youngsModulusMPa: 8500,
    bendingStrengthMPa: 38,
    densityKgM3: 550,
    description:
      "薄板を交互に重ねた強度の高い板材。棚板や背板に幅広く使われる。安価だが木口の仕上げが必要。",
  },
  {
    id: "mdf",
    name: "MDF（中密度繊維板）",
    nameEn: "MDF (Medium Density Fiberboard)",
    youngsModulusMPa: 3500,
    bendingStrengthMPa: 25,
    densityKgM3: 700,
    description:
      "木材繊維を固めた板材。表面が滑らかで塗装に最適。湿気に弱く、重いのが難点。カラーボックスに使用。",
  },
  {
    id: "paulownia",
    name: "桐（きり）",
    nameEn: "Paulownia",
    youngsModulusMPa: 5000,
    bendingStrengthMPa: 20,
    densityKgM3: 280,
    description:
      "非常に軽量で調湿性に優れる。衣類収納の棚板に最適。柔らかいため傷がつきやすい。",
  },
  {
    id: "oak",
    name: "オーク（ナラ）",
    nameEn: "Oak",
    youngsModulusMPa: 12000,
    bendingStrengthMPa: 60,
    densityKgM3: 680,
    description:
      "硬くて強度が高い広葉樹。高級感のある見た目で家具に人気。価格はやや高め。",
  },
  {
    id: "rubber",
    name: "ゴムの木（ラバーウッド）",
    nameEn: "Rubberwood",
    youngsModulusMPa: 9500,
    bendingStrengthMPa: 50,
    densityKgM3: 600,
    description:
      "ゴム採取後の木を利用したエコ素材。硬さと加工性のバランスが良く、集成材として人気。",
  },
];

/** IDから木材物性を取得 */
export const WOOD_PROPERTY_MAP = new Map(
  WOOD_PROPERTIES.map((w) => [w.id, w])
);

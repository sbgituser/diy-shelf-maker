import type { PartCategoryInfo } from "@/types";

export const PART_CATEGORIES: PartCategoryInfo[] = [
  {
    id: "adjuster",
    name: "突っ張りアジャスター",
    nameEn: "Tension Adjuster",
    description:
      "床と天井の間に2×4材などを突っ張って固定するためのパーツです。ラブリコ・ディアウォール・ウォリストなど複数のブランドがあり、耐荷重や対応木材サイズが異なります。棚のDIYにおける最重要パーツで、選び方によって安全性と使い勝手が大きく変わります。",
    icon: "🔧",
    slug: "adjuster",
    updatedAt: "2026-03-27",
  },
  {
    id: "lumber",
    name: "木材",
    nameEn: "Lumber",
    description:
      "棚の柱や構造材として使用する木材です。DIY棚ではSPF材（スプルース・パイン・ファー）の2×4材・1×4材が最も一般的で、ホームセンターで安価に入手できます。木材の規格・サイズ・強度を理解することで、安全で理想的な棚が作れます。",
    icon: "🪵",
    slug: "lumber",
    updatedAt: "2026-03-27",
  },
  {
    id: "board",
    name: "棚板・パネル材",
    nameEn: "Shelf Board",
    description:
      "棚の載せる面として使う板材です。パイン集成材・桐板・合板・メラミン化粧板など素材ごとに強度・見た目・加工性が異なります。用途や載せるものの重さ、インテリアのテイストに合わせて選ぶことが大切です。",
    icon: "📋",
    slug: "board",
    updatedAt: "2026-03-27",
  },
  {
    id: "bracket",
    name: "棚受け・金具",
    nameEn: "Bracket",
    description:
      "柱と棚板を繋ぐ金具類です。L字棚受け・ラブリコ専用棚受け・チャンネルサポート・アイアンブラケットなど多様な種類があります。耐荷重・見た目・取り付け方法を確認して選ぶことで、棚の安全性とデザイン性が高まります。",
    icon: "🔩",
    slug: "bracket",
    updatedAt: "2026-03-27",
  },
  {
    id: "fastener",
    name: "ネジ・接合具",
    nameEn: "Fastener",
    description:
      "木材同士や金具と木材を固定する接合パーツです。木ネジ・コーススレッド・ダボ・ボルトナットなど用途に応じて使い分けます。適切なサイズ・種類を選ぶことが、棚の強度と仕上がりに直結します。",
    icon: "🪛",
    slug: "fastener",
    updatedAt: "2026-03-27",
  },
  {
    id: "finish",
    name: "塗装・仕上げ",
    nameEn: "Finish",
    description:
      "木材の保護と見た目を整えるための塗料・ワックス類です。ワトコオイル・ブライワックス・水性ペンキ・ニスなど仕上がりの質感や耐久性が異なります。塗装前のヤスリがけも含め、仕上げ工程が棚の完成度を大きく左右します。",
    icon: "🎨",
    slug: "finish",
    updatedAt: "2026-03-27",
  },
  {
    id: "tool",
    name: "工具",
    nameEn: "Tool",
    description:
      "DIY棚を作るために必要な工具類です。電動ドリル・のこぎり・さしがね・メジャー・クランプなど各工程に適した工具を揃えることで、作業効率と仕上がりが向上します。初心者はまず基本工具から揃えることをおすすめします。",
    icon: "🛠️",
    slug: "tool",
    updatedAt: "2026-03-27",
  },
  {
    id: "accessory",
    name: "収納アクセサリー",
    nameEn: "Accessory",
    description:
      "棚に取り付けて収納力や使い勝手を高めるアクセサリーです。ブックエンド・Sフック・ワイヤーバスケット・有孔ボードなどを活用することで、棚をより機能的でおしゃれな収納スペースに仕上げることができます。",
    icon: "📦",
    slug: "accessory",
    updatedAt: "2026-03-27",
  },
];

export const PART_CATEGORY_MAP = Object.fromEntries(
  PART_CATEGORIES.map((c) => [c.id, c])
) as Record<string, PartCategoryInfo>;

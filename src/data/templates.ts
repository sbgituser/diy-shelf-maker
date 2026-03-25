import type { ShelfTemplate } from "@/types";

export const SHELF_TEMPLATES: ShelfTemplate[] = [
  {
    // 参考: 本棚/E1C48A87 — 短辺壁側、柱間に棚板を渡す
    id: "bookshelf",
    name: "本棚",
    icon: "📚",
    description:
      "短辺壁側で柱間に棚板を渡す定番構成。漫画・文庫の収納に。",
    defaults: {
      adjuster: "labrico",
      pillarLumber: "2x4",
      pillarCount: 2,
      shelfCount: 5,
      shelfWidth: 450,
      shelfDepth: 200,
      shelfMaterial: "pine-18",
      pillarOrientation: "short",
      layout: "straight",
      fullHeight: true,
    },
    keywords: ["本棚", "漫画", "コミック", "文庫"],
  },
  {
    // 参考: plantz画像 — 長辺壁側、ブラケットで棚板を手前に張り出す
    id: "wall-shelf",
    name: "壁掛け棚",
    icon: "🪝",
    description:
      "長辺壁側で柱スリム。ブラケットで棚板を手前に張り出す構成。",
    defaults: {
      adjuster: "labrico",
      pillarLumber: "2x4",
      pillarCount: 2,
      shelfCount: 4,
      shelfWidth: 600,
      shelfDepth: 250,
      shelfMaterial: "pine-18",
      pillarOrientation: "long",
      layout: "straight",
      fullHeight: true,
    },
    keywords: ["壁掛け", "飾り棚", "ディスプレイ"],
  },
];

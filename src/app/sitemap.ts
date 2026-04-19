import type { MetadataRoute } from "next";
import { SHELF_TEMPLATES } from "@/data/templates";
import { HOWTO_ARTICLES } from "@/data/howto-articles";
import { PART_CATEGORIES } from "@/data/part-categories";
import { PARTS_DICTIONARY } from "@/data/parts-dictionary";
import { DIY_PROJECTS, ALL_TAGS } from "@/data/projects";
import type { RoomType } from "@/types";

export const dynamic = "force-static";

const BASE_URL = "https://diy-shelf-maker.kuras-plus.com";

// コンテンツ初回公開日（テンプレート・パーツ辞典は日付フィールド未保持のためサイト開設日を使用）
const CONTENT_LAUNCH_DATE = new Date("2026-03-27");

// サイト全体の最終更新日（内部リンク・コンテンツ拡充を反映）
const SITE_LAST_UPDATED = new Date("2026-04-19");

// How-to記事の最終更新日（トップページのlastmodに使用。updatedAtを優先）
const LATEST_HOWTO_DATE = HOWTO_ARTICLES.reduce(
  (max, a) => {
    const d = new Date(a.updatedAt || a.publishedAt);
    return d > max ? d : max;
  },
  CONTENT_LAUNCH_DATE
);

export default function sitemap(): MetadataRoute.Sitemap {
  // 固定ページ
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      priority: 1.0,
      changeFrequency: "weekly",
      lastModified: LATEST_HOWTO_DATE,
    },
    {
      url: `${BASE_URL}/guide`,
      priority: 0.8,
      changeFrequency: "monthly",
      lastModified: SITE_LAST_UPDATED,
    },
    {
      url: `${BASE_URL}/templates`,
      priority: 0.8,
      changeFrequency: "weekly",
      lastModified: SITE_LAST_UPDATED,
    },
    {
      url: `${BASE_URL}/howto`,
      priority: 0.8,
      changeFrequency: "weekly",
      lastModified: LATEST_HOWTO_DATE,
    },
    {
      url: `${BASE_URL}/faq`,
      priority: 0.8,
      changeFrequency: "monthly",
      lastModified: SITE_LAST_UPDATED,
    },
    {
      url: `${BASE_URL}/tools`,
      priority: 0.8,
      changeFrequency: "monthly",
      lastModified: SITE_LAST_UPDATED,
    },
    {
      url: `${BASE_URL}/tools/shelf-load-calc`,
      priority: 0.8,
      changeFrequency: "monthly",
      lastModified: SITE_LAST_UPDATED,
    },
    {
      url: `${BASE_URL}/tools/material-cost-estimator`,
      priority: 0.8,
      changeFrequency: "monthly",
      lastModified: SITE_LAST_UPDATED,
    },
    {
      url: `${BASE_URL}/tools/support-system-picker`,
      priority: 0.8,
      changeFrequency: "monthly",
      lastModified: SITE_LAST_UPDATED,
    },
    {
      url: `${BASE_URL}/tools/shelf-planner-quiz`,
      priority: 0.9,
      changeFrequency: "monthly",
      lastModified: SITE_LAST_UPDATED,
    },
    {
      url: `${BASE_URL}/tools/projects`,
      priority: 0.9,
      changeFrequency: "weekly",
      lastModified: new Date("2026-04-13"),
    },
    {
      url: `${BASE_URL}/tools/material-calculator`,
      priority: 0.8,
      changeFrequency: "monthly",
      lastModified: new Date("2026-04-13"),
    },
    {
      url: `${BASE_URL}/tools/strength-checker`,
      priority: 0.8,
      changeFrequency: "monthly",
      lastModified: new Date("2026-04-13"),
    },
    {
      url: `${BASE_URL}/tools/wood-cut-calculator`,
      priority: 0.8,
      changeFrequency: "monthly",
      lastModified: new Date("2026-04-19"),
    },
  ];

  // テンプレート個別ページ（updatedAtがあればそちらを使用）
  const templatePages: MetadataRoute.Sitemap = SHELF_TEMPLATES.map((t) => ({
    url: `${BASE_URL}/templates/${t.id}`,
    priority: 0.8,
    changeFrequency: "monthly" as const,
    lastModified: t.updatedAt ? new Date(t.updatedAt) : CONTENT_LAUNCH_DATE,
  }));

  // How-to記事ページ（updatedAtを優先、なければpublishedAtを使用）
  const howtoPages: MetadataRoute.Sitemap = HOWTO_ARTICLES.map((a) => ({
    url: `${BASE_URL}/howto/${a.slug}`,
    priority: 0.7,
    changeFrequency: "monthly" as const,
    lastModified: new Date(a.updatedAt || a.publishedAt),
  }));

  // パーツ辞典トップ
  const partsTopPage: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/parts`,
      priority: 0.8,
      changeFrequency: "monthly" as const,
      lastModified: SITE_LAST_UPDATED,
    },
  ];

  // パーツ辞典カテゴリページ（updatedAtがあればそちらを使用）
  const partsCategoryPages: MetadataRoute.Sitemap = PART_CATEGORIES.map((cat) => ({
    url: `${BASE_URL}/parts/category/${cat.slug}`,
    priority: 0.7,
    changeFrequency: "monthly" as const,
    lastModified: cat.updatedAt ? new Date(cat.updatedAt) : CONTENT_LAUNCH_DATE,
  }));

  // パーツ辞典個別ページ（updatedAtがあればそちらを使用）
  const partsDetailPages: MetadataRoute.Sitemap = PARTS_DICTIONARY.map((p) => ({
    url: `${BASE_URL}/parts/${p.id}`,
    priority: 0.6,
    changeFrequency: "monthly" as const,
    lastModified: p.updatedAt ? new Date(p.updatedAt) : CONTENT_LAUNCH_DATE,
  }));

  // DIYプロジェクト個別ページ
  const projectPages: MetadataRoute.Sitemap = DIY_PROJECTS.map((p) => ({
    url: `${BASE_URL}/tools/projects/${p.id}`,
    priority: 0.7,
    changeFrequency: "monthly" as const,
    lastModified: p.updatedAt ? new Date(p.updatedAt) : new Date("2026-04-13"),
  }));

  // プロジェクト部屋タイプ別ページ
  const ROOM_TYPES: RoomType[] = ["1r", "1k", "1ldk", "family", "kids", "kitchen", "entrance", "workspace"];
  const projectRoomPages: MetadataRoute.Sitemap = ROOM_TYPES.map((rt) => ({
    url: `${BASE_URL}/tools/projects/room/${rt}`,
    priority: 0.7,
    changeFrequency: "monthly" as const,
    lastModified: new Date("2026-04-13"),
  }));

  // プロジェクトタグ別ページ
  const projectTagPages: MetadataRoute.Sitemap = ALL_TAGS.map((tag) => ({
    url: `${BASE_URL}/tools/projects/tag/${encodeURIComponent(tag)}`,
    priority: 0.6,
    changeFrequency: "monthly" as const,
    lastModified: new Date("2026-04-13"),
  }));

  return [
    ...staticPages,
    ...templatePages,
    ...howtoPages,
    ...partsTopPage,
    ...partsCategoryPages,
    ...partsDetailPages,
    ...projectPages,
    ...projectRoomPages,
    ...projectTagPages,
  ];
}

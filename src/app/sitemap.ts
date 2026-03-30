import type { MetadataRoute } from "next";
import { SHELF_TEMPLATES } from "@/data/templates";
import { HOWTO_ARTICLES } from "@/data/howto-articles";
import { PART_CATEGORIES } from "@/data/part-categories";
import { PARTS_DICTIONARY } from "@/data/parts-dictionary";

export const dynamic = "force-static";

const BASE_URL = "https://diy-shelf-maker.kuras-plus.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString();

  // 固定ページ
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      priority: 1.0,
      changeFrequency: "weekly",
      lastModified: now,
    },
    {
      url: `${BASE_URL}/guide`,
      priority: 0.8,
      changeFrequency: "monthly",
      lastModified: now,
    },
    {
      url: `${BASE_URL}/templates`,
      priority: 0.8,
      changeFrequency: "weekly",
      lastModified: now,
    },
    {
      url: `${BASE_URL}/howto`,
      priority: 0.8,
      changeFrequency: "weekly",
      lastModified: now,
    },
  ];

  // テンプレート個別ページ
  const templatePages: MetadataRoute.Sitemap = SHELF_TEMPLATES.map((t) => ({
    url: `${BASE_URL}/templates/${t.id}`,
    priority: 0.7,
    changeFrequency: "monthly" as const,
    lastModified: now,
  }));

  // How-to記事ページ
  const howtoPages: MetadataRoute.Sitemap = HOWTO_ARTICLES.map((a) => ({
    url: `${BASE_URL}/howto/${a.slug}`,
    priority: 0.7,
    changeFrequency: "monthly" as const,
    lastModified: now,
  }));

  // パーツ辞典トップ
  const partsTopPage: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/parts`,
      priority: 0.8,
      changeFrequency: "monthly" as const,
      lastModified: now,
    },
  ];

  // パーツ辞典カテゴリページ
  const partsCategoryPages: MetadataRoute.Sitemap = PART_CATEGORIES.map((cat) => ({
    url: `${BASE_URL}/parts/category/${cat.slug}`,
    priority: 0.7,
    changeFrequency: "monthly" as const,
    lastModified: now,
  }));

  // パーツ辞典個別ページ
  const partsDetailPages: MetadataRoute.Sitemap = PARTS_DICTIONARY.map((p) => ({
    url: `${BASE_URL}/parts/${p.id}`,
    priority: 0.6,
    changeFrequency: "monthly" as const,
    lastModified: now,
  }));

  return [
    ...staticPages,
    ...templatePages,
    ...howtoPages,
    ...partsTopPage,
    ...partsCategoryPages,
    ...partsDetailPages,
  ];
}

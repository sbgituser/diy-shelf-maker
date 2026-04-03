import type { MetadataRoute } from "next";
import { SHELF_TEMPLATES } from "@/data/templates";
import { HOWTO_ARTICLES } from "@/data/howto-articles";
import { PART_CATEGORIES } from "@/data/part-categories";
import { PARTS_DICTIONARY } from "@/data/parts-dictionary";

export const dynamic = "force-static";

const BASE_URL = "https://diy-shelf-maker.kuras-plus.com";

// コンテンツ初回公開日（テンプレート・パーツ辞典は日付フィールド未保持のためサイト開設日を使用）
const CONTENT_LAUNCH_DATE = new Date("2026-03-27");

// How-to記事の最終更新日（トップページのlastmodに使用。ビルド時刻ではなく実際の更新日を反映）
const LATEST_HOWTO_DATE = HOWTO_ARTICLES.reduce(
  (max, a) => new Date(a.publishedAt) > max ? new Date(a.publishedAt) : max,
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
      lastModified: CONTENT_LAUNCH_DATE,
    },
    {
      url: `${BASE_URL}/templates`,
      priority: 0.8,
      changeFrequency: "weekly",
      lastModified: CONTENT_LAUNCH_DATE,
    },
    {
      url: `${BASE_URL}/howto`,
      priority: 0.8,
      changeFrequency: "weekly",
      lastModified: CONTENT_LAUNCH_DATE,
    },
    {
      url: `${BASE_URL}/tools/shelf-load-calc`,
      priority: 0.8,
      changeFrequency: "monthly",
      lastModified: CONTENT_LAUNCH_DATE,
    },
    {
      url: `${BASE_URL}/tools/material-cost-estimator`,
      priority: 0.8,
      changeFrequency: "monthly",
      lastModified: CONTENT_LAUNCH_DATE,
    },
  ];

  // テンプレート個別ページ
  const templatePages: MetadataRoute.Sitemap = SHELF_TEMPLATES.map((t) => ({
    url: `${BASE_URL}/templates/${t.id}`,
    priority: 0.7,
    changeFrequency: "monthly" as const,
    lastModified: CONTENT_LAUNCH_DATE,
  }));

  // How-to記事ページ（実際の公開日を使用）
  const howtoPages: MetadataRoute.Sitemap = HOWTO_ARTICLES.map((a) => ({
    url: `${BASE_URL}/howto/${a.slug}`,
    priority: 0.7,
    changeFrequency: "monthly" as const,
    lastModified: new Date(a.publishedAt),
  }));

  // パーツ辞典トップ
  const partsTopPage: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/parts`,
      priority: 0.8,
      changeFrequency: "monthly" as const,
      lastModified: CONTENT_LAUNCH_DATE,
    },
  ];

  // パーツ辞典カテゴリページ
  const partsCategoryPages: MetadataRoute.Sitemap = PART_CATEGORIES.map((cat) => ({
    url: `${BASE_URL}/parts/category/${cat.slug}`,
    priority: 0.7,
    changeFrequency: "monthly" as const,
    lastModified: CONTENT_LAUNCH_DATE,
  }));

  // パーツ辞典個別ページ
  const partsDetailPages: MetadataRoute.Sitemap = PARTS_DICTIONARY.map((p) => ({
    url: `${BASE_URL}/parts/${p.id}`,
    priority: 0.6,
    changeFrequency: "monthly" as const,
    lastModified: CONTENT_LAUNCH_DATE,
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

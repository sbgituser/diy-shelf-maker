import type { MetadataRoute } from "next";
import { SHELF_TEMPLATES } from "@/data/templates";

export const dynamic = "force-static";

const BASE_URL = "https://diy.kuras-plus.com";

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
      priority: 0.9,
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

  return [...staticPages, ...templatePages];
}

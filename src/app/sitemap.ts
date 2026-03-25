import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const BASE_URL = "https://diy.kuras-plus.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: BASE_URL,
      priority: 1.0,
      changeFrequency: "weekly",
    },
    {
      url: `${BASE_URL}/guide`,
      priority: 0.8,
      changeFrequency: "monthly",
    },
  ];
}

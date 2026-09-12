import type { MetadataRoute } from "next";
import { DIRECTORY_CATEGORIES, categoryPath, filterByCategory, groupBySido } from "@/lib/directory";
import { getRegisteredBusinesses } from "@/lib/registry";
import { getSiteUrl } from "@/lib/seo";
export const revalidate = 86400;

/** 정적·업종·시·도 랜딩 사이트맵 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const now = new Date();
  const all = await getRegisteredBusinesses();

  const entries: MetadataRoute.Sitemap = [
    { url: base, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${base}/c`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
  ];

  for (const c of DIRECTORY_CATEGORIES) {
    entries.push({
      url: `${base}${categoryPath(c.slug)}`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.8,
    });

    const matched = filterByCategory(all, c);
    for (const g of groupBySido(matched)) {
      entries.push({
        url: `${base}${categoryPath(c.slug, g.sido)}`,
        lastModified: now,
        changeFrequency: "daily",
        priority: 0.75,
      });
    }
  }

  return entries;
}

import type { MetadataRoute } from "next";
import { businessPath } from "@/lib/directory";
import { getRegisteredBusinesses } from "@/lib/registry";
import { getSiteUrl } from "@/lib/seo";
import {
  PLACE_SITEMAP_CHUNK,
  PLACE_SITEMAP_FILE_COUNT,
  REVALIDATE_SITEMAP,
} from "@/lib/cache-config";

export const revalidate = REVALIDATE_SITEMAP;

/** /place/sitemap/0.xml … — 업체 상세 URL (Google 5만 제한 대비 분할) */
export async function generateSitemaps() {
  return Array.from({ length: Math.max(1, PLACE_SITEMAP_FILE_COUNT) }, (_, id) => ({ id }));
}

export default async function sitemap(props: {
  id: Promise<number | string>;
}): Promise<MetadataRoute.Sitemap> {
  const raw = await props.id;
  const id = Number(raw);
  const base = getSiteUrl();
  const all = await getRegisteredBusinesses();
  const start = id * PLACE_SITEMAP_CHUNK;
  const slice = all.slice(start, start + PLACE_SITEMAP_CHUNK);

  return slice.map((b) => ({
    url: `${base}${businessPath(b.id)}`,
    lastModified: b.updatedAt ? new Date(b.updatedAt) : new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));
}

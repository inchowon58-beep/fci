import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/seo";
import { PLACE_SITEMAP_FILE_COUNT } from "@/lib/cache-config";

/** 27MB registry 로드 없이 robots만 응답 — 크롤 시 함수 비용↓ */
export default function robots(): MetadataRoute.Robots {
  const base = getSiteUrl();
  const placeMaps = Math.max(1, PLACE_SITEMAP_FILE_COUNT);
  const sitemaps = [
    `${base}/sitemap.xml`,
    ...Array.from({ length: placeMaps }, (_, i) => `${base}/place/sitemap/${i}.xml`),
  ];

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api/", "/import"],
      },
    ],
    sitemap: sitemaps,
    host: base,
  };
}

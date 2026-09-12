import { DIRECTORY_CATEGORIES, categoryPath } from "@/lib/directory";
import { readCms, sortedNotices } from "@/lib/cms";
import { getSiteUrl, absoluteUrl } from "@/lib/seo";
import { site } from "@/lib/copy";

export const revalidate = 3600;

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** 네이버 서치어드바이저용 RSS */
export async function GET() {
  const base = getSiteUrl();
  const cms = await readCms();
  const notices = sortedNotices(cms, 20);
  const now = new Date().toUTCString();

  const items: { title: string; link: string; description: string; pubDate: string }[] = [
    {
      title: site.name,
      link: base,
      description: site.description,
      pubDate: now,
    },
    {
      title: "반려동물 업종 디렉터리",
      link: absoluteUrl("/c"),
      description: "동물병원·펫샵·미용 등 반려동물 업종을 지역별로 찾습니다.",
      pubDate: now,
    },
    ...DIRECTORY_CATEGORIES.map((c) => ({
      title: c.title,
      link: absoluteUrl(categoryPath(c.slug)),
      description: c.blurb || `${c.title} 업체 디렉터리`,
      pubDate: now,
    })),
    ...notices.map((n) => ({
      title: n.title,
      link: n.href?.startsWith("http") ? n.href : absoluteUrl(n.href || "/"),
      description: n.title,
      pubDate: n.date ? new Date(n.date).toUTCString() : now,
    })),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(site.name)}</title>
    <link>${escapeXml(base)}</link>
    <description>${escapeXml(site.description)}</description>
    <language>ko</language>
    <lastBuildDate>${now}</lastBuildDate>
    ${items
      .map(
        (item) => `<item>
      <title>${escapeXml(item.title)}</title>
      <link>${escapeXml(item.link)}</link>
      <guid>${escapeXml(item.link)}</guid>
      <description>${escapeXml(item.description)}</description>
      <pubDate>${item.pubDate}</pubDate>
    </item>`,
      )
      .join("\n    ")}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=3600",
    },
  });
}

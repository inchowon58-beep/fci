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

function toRfc822(input?: string) {
  const d = input ? new Date(input) : new Date();
  if (Number.isNaN(d.getTime())) return new Date().toUTCString();
  return d.toUTCString();
}

/** 네이버 서치어드바이저용 RSS 2.0 */
export async function GET() {
  const base = getSiteUrl();
  const feedUrl = `${base}/rss.xml`;
  const cms = await readCms();
  const notices = sortedNotices(cms, 20);
  const buildDate = toRfc822();

  type Item = {
    title: string;
    link: string;
    description: string;
    pubDate: string;
  };

  const items: Item[] = [
    {
      title: site.name,
      link: `${base}/`,
      description: site.description,
      pubDate: buildDate,
    },
    {
      title: "반려동물 업종 디렉터리",
      link: absoluteUrl("/c"),
      description: "동물병원·펫샵·미용 등 반려동물 업종을 지역별로 찾습니다.",
      pubDate: buildDate,
    },
    ...DIRECTORY_CATEGORIES.map((c) => ({
      title: c.title,
      link: absoluteUrl(categoryPath(c.slug)),
      description: c.blurb || `${c.title} 업체 디렉터리`,
      pubDate: buildDate,
    })),
    ...notices.map((n) => {
      const link =
        n.href && /^https?:\/\//i.test(n.href)
          ? n.href
          : n.href
            ? absoluteUrl(n.href)
            : `${base}/`;
      // 네이버: 소유 확인 도메인과 item URL 도메인이 같아야 함
      let safeLink = link;
      try {
        const u = new URL(link);
        if (u.origin !== base) safeLink = `${base}/`;
      } catch {
        safeLink = `${base}/`;
      }
      return {
        title: n.title,
        link: safeLink,
        description: n.title,
        pubDate: toRfc822(n.date),
      };
    }),
  ].filter((item) => item.title && item.link.startsWith(base));

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(site.name)}</title>
    <link>${escapeXml(base)}/</link>
    <description>${escapeXml(site.description)}</description>
    <language>ko</language>
    <lastBuildDate>${buildDate}</lastBuildDate>
    <atom:link href="${escapeXml(feedUrl)}" rel="self" type="application/rss+xml" />
    ${items
      .map(
        (item) => `<item>
      <title>${escapeXml(item.title)}</title>
      <link>${escapeXml(item.link)}</link>
      <guid isPermaLink="true">${escapeXml(item.link)}</guid>
      <description><![CDATA[${item.description}]]></description>
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

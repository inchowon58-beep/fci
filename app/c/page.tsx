import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { DIRECTORY_CATEGORIES, categoryPath, filterByCategory } from "@/lib/directory";
import { getRegisteredBusinesses } from "@/lib/registry";
import { buildDirectoryIndexMetadata, absoluteUrl, getSiteUrl } from "@/lib/seo";
import { site } from "@/lib/copy";
export const revalidate = 3600;

export const metadata: Metadata = buildDirectoryIndexMetadata();

export default async function DirectoryIndexPage() {
  const businesses = await getRegisteredBusinesses();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "반려동물 업종 디렉터리",
    url: absoluteUrl("/c"),
    description:
      "동물병원·펫샵·미용 등 반려동물 업종을 지역별로 찾는 한국애견연맹 반려문화증진위원회 디렉터리",
    isPartOf: { "@id": `${getSiteUrl()}/#website` },
    publisher: { "@type": "Organization", name: site.name },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: DIRECTORY_CATEGORIES.map((c, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: c.title,
        url: absoluteUrl(categoryPath(c.slug)),
      })),
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SiteHeader />
      <main className="section-bx pt-16">
        <div className="container-bx">
          <p className="eyebrow mb-4">DIRECTORY · 한국애견연맹 반려문화증진위원회</p>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl">
            반려동물 업종 디렉터리 — 지역별로 찾기
          </h1>
          <p className="mt-4 max-w-2xl text-[var(--fg-soft)]">
            한국애견연맹 반려문화증진위원회가 모은 동물병원·펫샵·미용·호텔 등 업종별 업체 목록입니다. 카테고리를
            누르면 시·도별로 볼 수 있습니다.
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {DIRECTORY_CATEGORIES.map((c) => {
              const count = filterByCategory(businesses, c).length;
              return (
                <a
                  key={c.slug}
                  href={categoryPath(c.slug)}
                  className="glow-card block p-5 hover:-translate-y-0.5 transition-transform"
                >
                  <div className="text-2xl">{c.icon}</div>
                  <h2 className="mt-3 font-bold">{c.title}</h2>
                  <p className="mt-2 text-sm text-[var(--fg-muted)]">{c.blurb}</p>
                  <p className="mt-4 text-sm text-[var(--accent)]">{count}곳 등록</p>
                </a>
              );
            })}
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

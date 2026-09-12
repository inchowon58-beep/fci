import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { BusinessCard } from "@/components/business-card";
import { categoryPath, getCategoryListing } from "@/lib/directory";
import { buildCategoryJsonLd, buildCategoryMetadata } from "@/lib/seo";
import { REVALIDATE_DIRECTORY } from "@/lib/cache-config";

export const revalidate = REVALIDATE_DIRECTORY;

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string; sido: string }>;
  searchParams: Promise<{ page?: string }>;
}): Promise<Metadata> {
  const { slug, sido: sidoRaw } = await params;
  const sido = decodeURIComponent(sidoRaw);
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page) || 1);
  const listing = await getCategoryListing(slug, { sido, page });
  if (!listing) return { title: "지역 업종을 찾을 수 없습니다" };
  const sidoTotal = listing.groups[0]?.totalInSido ?? 0;
  return buildCategoryMetadata({
    category: listing.category,
    sido,
    total: sidoTotal,
    page: listing.page,
  });
}

/** 도시(시·도) 랜딩 — /c/hospital/서울특별시 */
export default async function CategorySidoPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string; sido: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { slug, sido: sidoRaw } = await params;
  const sido = decodeURIComponent(sidoRaw);
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page) || 1);
  const listing = await getCategoryListing(slug, { sido, page });
  if (!listing) notFound();

  const { category, groups, sidos, pageCount } = listing;
  const group = groups[0];
  const sidoTotal = group?.totalInSido ?? 0;
  const sampleNames = (group?.items || []).map((b) => b.name);
  const jsonLd = buildCategoryJsonLd({
    category,
    sido,
    total: sidoTotal,
    sampleNames,
  });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SiteHeader />
      <main className="section-bx pt-16">
        <div className="container-bx">
          <p className="text-sm text-[var(--fg-muted)]">
            <a href="/c" className="hover:text-[var(--accent)]">
              업종
            </a>
            <span className="mx-2">/</span>
            <a href={categoryPath(slug)} className="hover:text-[var(--accent)]">
              {category.title}
            </a>
            <span className="mx-2">/</span>
            {sido}
          </p>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-5xl">
            {sido} {category.title}
          </h1>
          <p className="mt-3 text-[var(--fg-soft)]">
            한국애견연맹 반려문화증진위원회 · {sido} {category.title} {sidoTotal.toLocaleString()}곳. 영업상태·전화·주소를
            지역 기준으로 모았습니다.
          </p>

          {sidos.length > 0 ? (
            <div className="mt-6 flex flex-wrap gap-2">
              <a
                href={categoryPath(slug)}
                className="rounded-full px-3 py-1.5 text-sm border border-[var(--border)] text-[var(--fg-soft)]"
              >
                전국 미리보기
              </a>
              {sidos.map((item) => (
                <a
                  key={item.sido}
                  href={categoryPath(slug, item.sido)}
                  className={`rounded-full px-3 py-1.5 text-sm ${
                    item.sido === sido
                      ? "bg-[var(--accent)] text-[var(--bg)]"
                      : "border border-[var(--border)] text-[var(--fg-soft)]"
                  }`}
                >
                  {item.sido} {item.count.toLocaleString()}
                </a>
              ))}
            </div>
          ) : null}

          {sidoTotal === 0 ? (
            <div className="glow-card mt-10 p-8">
              <p className="font-semibold">이 지역·업종 조합에는 아직 등록 업체가 없습니다.</p>
              <a href={categoryPath(slug)} className="btn-ghost mt-5 text-sm min-h-10 px-4">
                전국 {category.title} 보기
              </a>
            </div>
          ) : (
            <div className="mt-10">
              <h2 className="text-xl font-bold">
                {sido} 목록 · {sidoTotal.toLocaleString()}곳
              </h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {(group?.items || []).map((business) => (
                  <BusinessCard key={business.id} business={business} />
                ))}
              </div>
            </div>
          )}

          {pageCount > 1 ? (
            <nav className="mt-10 flex flex-wrap items-center justify-center gap-2" aria-label="페이지">
              {listing.page > 1 ? (
                <a
                  className="rounded-full border border-[var(--border)] px-4 py-2 text-sm"
                  href={categoryPath(slug, sido, listing.page - 1)}
                >
                  이전
                </a>
              ) : null}
              <span className="text-sm text-[var(--fg-muted)]">
                {listing.page} / {pageCount}
              </span>
              {listing.page < pageCount ? (
                <a
                  className="rounded-full border border-[var(--border)] px-4 py-2 text-sm"
                  href={categoryPath(slug, sido, listing.page + 1)}
                >
                  다음
                </a>
              ) : null}
            </nav>
          ) : null}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

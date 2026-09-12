import { notFound, redirect } from "next/navigation";
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
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const listing = await getCategoryListing(slug);
  if (!listing) return { title: "업종을 찾을 수 없습니다" };
  return buildCategoryMetadata({
    category: listing.category,
    total: listing.total,
  });
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ sido?: string; page?: string }>;
}) {
  const { slug } = await params;
  const sp = await searchParams;

  // 구 URL ?sido= → 경로형 도시 랜딩으로 이전
  if (sp.sido) {
    const q = sp.page && Number(sp.page) > 1 ? `?page=${sp.page}` : "";
    redirect(`${categoryPath(slug, sp.sido)}${q}`);
  }

  const listing = await getCategoryListing(slug);
  if (!listing) notFound();

  const { category, total, groups, sidos, mode } = listing;
  const sampleNames = groups.flatMap((g) => g.items.map((b) => b.name)).slice(0, 20);
  const jsonLd = buildCategoryJsonLd({
    category,
    total,
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
            {category.title}
          </p>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-5xl">
            {category.icon} {category.title} 전국
          </h1>
          <p className="mt-3 text-[var(--fg-soft)]">
            한국애견연맹 반려문화증진위원회 디렉터리 · 전국 {total.toLocaleString()}곳 등록 · 지역을 고르면 해당
            시·도만 빠르게 볼 수 있습니다.
          </p>

          {sidos.length > 0 ? (
            <div className="mt-6 flex flex-wrap gap-2">
              <a
                href={categoryPath(slug)}
                className="rounded-full px-3 py-1.5 text-sm bg-[var(--accent)] text-[var(--bg)]"
              >
                전국 미리보기
              </a>
              {sidos.map((item) => (
                <a
                  key={item.sido}
                  href={categoryPath(slug, item.sido)}
                  className="rounded-full px-3 py-1.5 text-sm border border-[var(--border)] text-[var(--fg-soft)]"
                >
                  {item.sido} {item.count.toLocaleString()}
                </a>
              ))}
            </div>
          ) : null}

          {mode === "preview" ? (
            <p className="mt-4 text-sm text-[var(--fg-muted)]">
              지금은 시·도별 일부만 보여 줍니다. 전체 목록은 위 지역 버튼을 눌러 주세요.
            </p>
          ) : null}

          {total === 0 ? (
            <div className="glow-card mt-10 p-8">
              <p className="font-semibold">이 업종은 아직 공공데이터에서 가져온 업체가 없습니다.</p>
              <a href="/c" className="btn-ghost mt-5 text-sm min-h-10 px-4">
                다른 업종 보기
              </a>
            </div>
          ) : (
            <div className="mt-10 space-y-12">
              {groups.map((group) => (
                <section key={group.sido} id={group.sido}>
                  <div className="flex flex-wrap items-end justify-between gap-3">
                    <div>
                      <h2 className="text-2xl font-bold">{group.sido}</h2>
                      <p className="mt-1 text-sm text-[var(--fg-muted)]">
                        {group.totalInSido.toLocaleString()}곳 중 {group.items.length}곳 미리보기
                      </p>
                    </div>
                    {group.totalInSido > group.items.length ? (
                      <a
                        href={categoryPath(slug, group.sido)}
                        className="text-sm font-semibold text-[var(--accent)] hover:underline"
                      >
                        {group.sido} 전체 보기 →
                      </a>
                    ) : null}
                  </div>
                  <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {group.items.map((business) => (
                      <BusinessCard key={business.id} business={business} />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

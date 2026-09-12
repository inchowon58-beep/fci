import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { PlaceNaverBlogsLazy, PlaceNaverGalleryLazy } from "@/components/place/place-naver-lazy";
import { PlaceShare } from "@/components/place/place-share";
import { PlaceTabs } from "@/components/place/place-tabs";
import { PlacePartnerPanel } from "@/components/place/place-partner-panel";
import { KkfNoticeBoard } from "@/components/place/kkf-notice-board";
import {
  DIRECTORY_CATEGORIES,
  businessPath,
  categoryOfBusiness,
  categoryPath,
  getBusiness,
  sidoOf,
  sigunguOf,
} from "@/lib/directory";
import { mapLinks, placeCopy } from "@/lib/place";
import { getRegisteredBusinesses } from "@/lib/registry";
import { activePartners, readCms, sortedNotices } from "@/lib/cms";
import { pickRelatedBusinesses } from "@/lib/related";
import { site } from "@/lib/copy";
import { buildPlaceJsonLd, buildPlaceMetadata } from "@/lib/seo";
import { REVALIDATE_PLACE } from "@/lib/cache-config";

/** CDN ISR — 재방문·크롤은 함수 재실행 없이 캐시 HTML */
export const revalidate = REVALIDATE_PLACE;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const business = await getBusiness(decodeURIComponent(id));
  if (!business) return { title: `업체를 찾을 수 없습니다 — ${site.name}` };
  return buildPlaceMetadata(business);
}

export default async function PlacePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const business = await getBusiness(decodeURIComponent(id));
  if (!business) notFound();

  const category = categoryOfBusiness(business);
  const sido = sidoOf(business);
  const city = sigunguOf(business);
  const copy = placeCopy(business);
  const maps = mapLinks(copy.address || `${business.name} ${business.region}`);

  const [cms, all] = await Promise.all([readCms(), getRegisteredBusinesses()]);
  const partners = activePartners(cms);
  const notices = sortedNotices(cms, 6);
  const { nearby, similar, others } = pickRelatedBusinesses(all, business);

  const infoRows = [
    { k: "주소", v: business.address },
    { k: "전화", v: business.phone, tel: true },
    { k: "업종", v: business.category },
    { k: "영업상태", v: business.status },
    { k: "영업시간", v: business.hours },
    { k: "인허가일", v: business.licensedAt },
    { k: "응급·야간", v: business.emergency ? "가능" : undefined },
    { k: "데이터 출처", v: business.source },
  ].filter((row) => row.v);

  const placeJsonLd = buildPlaceJsonLd(business, maps, category?.slug);

  return (
    <>
      <SiteHeader />
      <div className="place-page">
        <div className="container-bx place-body">
          <nav className="place-bc" aria-label="위치">
            <a href="/c">전국</a> ›{" "}
            <a href={category ? categoryPath(category.slug, sido) : "/c"}>{city}</a> ›{" "}
            <span>{business.name}</span>
          </nav>

          <div className="place-top">
            <div className="place-hero">
              <p className="place-hero-eyebrow">{site.shortName} 반려문화증진위원회</p>
              <h1>{business.name}</h1>
              <div className="place-hmeta">
                {category ? (
                  <a href={categoryPath(category.slug, sido)}>{business.category}</a>
                ) : (
                  <span>{business.category}</span>
                )}{" "}
                · <a href={category ? categoryPath(category.slug, sido) : "/c"}>{city}</a>
              </div>
              <div className="place-qbar">
                <a className="place-qbtn" href={maps.kakao} target="_blank" rel="noopener">
                  <span className="place-qi">→</span>
                  <span className="place-qp">길찾기</span>
                </a>
                <PlaceShare />
              </div>
            </div>

            <section className="place-card place-summary-side" id="summary">
              <h2>한눈 요약</h2>
              <dl className="place-sum">
                {copy.summaryItems.map((item) => (
                  <div className="place-sum-row" key={item.label}>
                    <dt>{item.label}</dt>
                    <dd>{item.value}</dd>
                  </div>
                ))}
              </dl>
            </section>
          </div>

          <PlaceNaverGalleryLazy name={business.name} city={city} />

          <PlaceTabs />

          <section className="place-card place-about">
            <h3 className="place-q">{business.name}은 어떤 곳인가요?</h3>
            <p className="place-lead">{copy.lead}</p>
          </section>

          <section className="place-intro">
            <h2>소개</h2>
            <p>{copy.intro}</p>
          </section>

          <span id="bxa_info" className="place-anc" />
          <h2 className="place-sec">매장 정보</h2>
          <dl className="place-info">
            {infoRows.map((row) => (
              <div className="place-ir" key={row.k}>
                <dt className="k">{row.k}</dt>
                <dd className="v">
                  {row.tel && row.v ? <a href={`tel:${row.v}`}>{row.v}</a> : row.v}
                </dd>
              </div>
            ))}
          </dl>

          <span id="bxa_qa" className="place-anc" />
          <h2 className="place-sec">자주 묻는 질문</h2>
          <div className="place-card place-qa">
            {copy.faqs.map((faq) => (
              <details key={faq.q} className="place-qa-item" open>
                <summary>
                  <h3>Q. {faq.q}</h3>
                </summary>
                <div className="a">{faq.a}</div>
              </details>
            ))}
          </div>

          <span id="bx_map" className="place-anc" />
          <h2 className="place-sec">위치</h2>
          <h3 className="place-q">{business.name} 찾아가는 길</h3>
          <p className="place-a">{copy.address}</p>
          <iframe className="place-map" loading="lazy" title="지도" src={maps.googleEmbed} />
          <div className="place-maplinks">
            <a href={maps.kakao} target="_blank" rel="noopener">
              카카오맵
            </a>
            <a href={maps.naver} target="_blank" rel="noopener">
              네이버지도
            </a>
          </div>

          <PlaceNaverBlogsLazy name={business.name} city={city} />

          <span id="partners" className="place-anc" />
          <h2 className="place-sec">제휴 · 연맹 안내</h2>
          <PlacePartnerPanel
            partners={partners}
            notice={<KkfNoticeBoard notices={notices} kkf={cms.kkf} />}
          />

          <span id="bxa_near" className="place-anc" />
          <h2 className="place-sec">함께 가볼 만한 곳</h2>
          {nearby.length > 0 ? (
            <div className="place-neargrid">
              {nearby.map((item) => (
                <a key={item.id} href={businessPath(item.id)} className="place-nearcard">
                  <div className="place-nearph">{categoryOfBusiness(item)?.icon ?? "🐾"}</div>
                  <div className="place-nearcaption">
                    <div className="n">{item.name}</div>
                    <div className="m">
                      {item.category} · {sigunguOf(item)}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <p className="place-mut">같은 지역에 아직 더 등록된 업체가 없습니다.</p>
          )}

          <h2 className="place-sec">
            {sido} {city} 더 보기
          </h2>
          {similar.length > 0 ? (
            <div className="place-crow">
              <b>비슷한 곳</b>
              <div className="place-chips">
                {similar.map((item) => (
                  <a key={item.id} className="place-chip" href={businessPath(item.id)}>
                    {item.name}
                  </a>
                ))}
              </div>
            </div>
          ) : null}
          {others.length > 0 ? (
            <div className="place-crow">
              <b>근처 다른 업체</b>
              <div className="place-chips">
                {others.map((item) => (
                  <a key={item.id} className="place-chip" href={businessPath(item.id)}>
                    {item.name}
                  </a>
                ))}
              </div>
            </div>
          ) : null}
          {category ? (
            <p className="place-mut place-sm">
              <a href={categoryPath(category.slug, sido)}>
                {sido} {city} {category.title} 전체 보기 →
              </a>
            </p>
          ) : null}

          <div className="place-chips">
            {DIRECTORY_CATEGORIES.slice(0, 8).map((c) => (
              <a key={c.slug} className="place-chip" href={categoryPath(c.slug, sido)}>
                {c.title}
              </a>
            ))}
          </div>

          <div className="place-ctas">
            <a className="place-cta" href="/#owner">
              이 업체 사장님이세요? 무료 등록 →
            </a>
            <a className="place-cta2" href="/#first">
              노출 세팅 안내 →
            </a>
          </div>

          <div className="place-tags">
            <a className="place-tag" href={category ? categoryPath(category.slug, sido) : "/c"}>
              #{city}
              {business.category}
            </a>
            <a className="place-tag" href="/c">
              #{city}반려견
            </a>
            <a className="place-tag" href={businessPath(business.id)}>
              #{business.name.replace(/\s+/g, "")}
            </a>
          </div>

          <p className="place-foot">
            {site.name} — 공공데이터 인허가 기준 ·{" "}
            <a href={cms.kkf.siteUrl} target="_blank" rel="noopener noreferrer">
              {cms.kkf.org}
            </a>
          </p>
        </div>

        <div className="place-fbar">
          <a className="place-fb" href={maps.kakao} target="_blank" rel="noopener">
            길찾기
          </a>
          <a className="place-fb place-fb-o" href="/#owner">
            내 업체
          </a>
        </div>

        <div className="place-notice">
          본 페이지는 공공데이터와 {site.name} 등록 정보를 바탕으로 안내합니다. 실제 운영은 업체에 확인해 주세요.
          <br />
          <a href="/#owner">정보 정정·삭제 요청</a> ·{" "}
          <a href={site.officialUrl} target="_blank" rel="noopener noreferrer">
            {site.officialName} 공식 사이트
          </a>
        </div>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(placeJsonLd),
          }}
        />
      </div>
      <SiteFooter />
    </>
  );
}

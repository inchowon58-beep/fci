import type { Metadata } from "next";
import { faq, site } from "@/lib/copy";
import type { PetBusiness } from "@/lib/public-data";
import type { DirectoryCategory } from "@/lib/directory";
import { businessPath, categoryPath, sidoOf, sigunguOf } from "@/lib/directory";
import { placeCopy } from "@/lib/place";

export function getSiteUrl() {
  const candidates = [
    process.env.NEXT_PUBLIC_SITE_URL?.trim(),
    process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : undefined,
    // 이 프로젝트 기본 프로덕션 도메인
    "https://fci.infocs.co.kr",
  ];

  for (const raw of candidates) {
    if (!raw) continue;
    try {
      const origin = new URL(raw.includes("://") ? raw : `https://${raw}`).origin;
      // 로컬호스트는 배포·네이버 제출용으로 쓰지 않음
      if (/localhost|127\.0\.0\.1/i.test(origin)) continue;
      return origin;
    } catch {
      // try next
    }
  }

  return "https://fci.infocs.co.kr";
}

export function absoluteUrl(path: string) {
  const base = getSiteUrl();
  if (!path) return base;
  if (/^https?:\/\//i.test(path)) return path;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

/** 메인(/) SEO · AEO — 핵심 키워드: 한국애견연맹 · 반려문화증진위원회 */
export const homeSeo = {
  title: "한국애견연맹 반려문화증진위원회 | 동네 반려문화 디렉터리",
  description:
    "한국애견연맹 반려문화증진위원회 — 연맹의 대외 홍보와 반려문화 증진을 위해 운영됩니다. 동물병원·펫샵·미용·호텔·카페 등 동네 반려동물 업종 정보를 한곳에서 무료로 확인하세요.",
  keywords: [
    "한국애견연맹",
    "반려문화증진위원회",
    "한국애견연맹 반려문화증진위원회",
    "사단법인 한국애견연맹",
    "KKF",
    "반려문화",
    "반려동물 디렉터리",
    "동물병원",
    "펫샵",
    "애견미용",
    "펫호텔",
    "펫카페",
    "반려견",
  ],
} as const;

const defaultRobots: Metadata["robots"] = {
  index: true,
  follow: true,
  googleBot: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
  },
};

export function buildHomeMetadata(): Metadata {
  const base = getSiteUrl();
  const title = homeSeo.title;
  const description = homeSeo.description;
  const ogImage = `${base}/kkf/logo.png`;

  return {
    title: { absolute: title },
    description,
    keywords: [...homeSeo.keywords],
    applicationName: site.name,
    authors: [{ name: site.name }],
    creator: site.name,
    publisher: site.officialName,
    category: "반려동물",
    alternates: { canonical: base },
    openGraph: {
      type: "website",
      locale: "ko_KR",
      url: base,
      siteName: site.name,
      title,
      description,
      images: [{ url: ogImage, width: 512, height: 512, alt: site.name }],
    },
    twitter: { card: "summary", title, description, images: [ogImage] },
    robots: defaultRobots,
  };
}

export function buildDirectoryIndexMetadata(): Metadata {
  const url = absoluteUrl("/c");
  const title = "반려동물 업종 디렉터리 | 한국애견연맹 반려문화증진위원회";
  const description =
    "동물병원·동물약국·펫샵·미용·호텔·카페·훈련·시터 등 반려동물 업종을 지역별로 찾는 한국애견연맹 반려문화증진위원회 디렉터리입니다.";
  return {
    title: { absolute: title },
    description,
    keywords: ["반려동물", "동물병원", "펫샵", "애견미용", "한국애견연맹", "반려문화증진위원회", "지역 업체"],
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale: "ko_KR",
      url,
      siteName: site.name,
      title,
      description,
      images: [{ url: absoluteUrl("/kkf/logo.png"), alt: site.name }],
    },
    robots: defaultRobots,
  };
}

export function buildCategoryMetadata(opts: {
  category: DirectoryCategory;
  sido?: string;
  total: number;
  page?: number;
}): Metadata {
  const { category, sido, total, page = 1 } = opts;
  const area = sido || "전국";
  const title = sido
    ? `${sido} ${category.title} | 한국애견연맹 반려문화증진위원회`
    : `${category.title} 전국 | 한국애견연맹 반려문화증진위원회`;
  const description = sido
    ? `${sido} ${category.title} ${total.toLocaleString()}곳을 한국애견연맹 반려문화증진위원회 디렉터리에서 확인하세요. 영업상태·전화·주소 등 공공데이터 기준 정보를 지역별로 모았습니다.`
    : `전국 ${category.title} ${total.toLocaleString()}곳. 시·도별로 반려동물 관련 업체를 찾는 한국애견연맹 반려문화증진위원회 디렉터리입니다.`;
  const path = categoryPath(category.slug, sido, page > 1 ? page : undefined);
  const url = absoluteUrl(path);
  const keywords = [
    `${area} ${category.title}`,
    `${area}${category.title.replace(/\s·\s.*/, "")}`,
    category.title,
    "반려동물",
    "반려견",
    "한국애견연맹",
    "반려문화증진위원회",
    ...(sido ? [sido, `${sido} 동물병원`, `${sido} 펫샵`] : ["전국"]),
  ];

  return {
    title: { absolute: title },
    description,
    keywords,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale: "ko_KR",
      url,
      siteName: site.name,
      title,
      description,
      images: [{ url: absoluteUrl("/kkf/logo.png"), alt: title }],
    },
    twitter: { card: "summary", title, description },
    robots: defaultRobots,
  };
}

export function buildPlaceMetadata(business: PetBusiness): Metadata {
  const city = sigunguOf(business);
  const sido = sidoOf(business);
  const copy = placeCopy(business);
  const path = businessPath(business.id);
  const url = absoluteUrl(path);
  const title = `${city} ${business.name} | ${business.category} · 한국애견연맹 반려문화증진위원회`;
  const description = copy.lead.slice(0, 155);
  const keywords = [
    `${city} ${business.category}`,
    `${city}${business.category}`,
    `${sido} ${business.category}`,
    business.name,
    city,
    sido,
    "반려견",
    "반려동물",
    "한국애견연맹",
    "반려문화증진위원회",
  ];

  return {
    title: { absolute: title },
    description,
    keywords,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale: "ko_KR",
      url,
      siteName: site.name,
      title,
      description,
      images: [{ url: absoluteUrl("/kkf/logo.png"), alt: `${business.name} · ${city}` }],
    },
    twitter: { card: "summary", title, description },
    robots: defaultRobots,
  };
}

function parseAddressParts(business: PetBusiness) {
  const sido = sidoOf(business);
  const city = sigunguOf(business);
  const street = business.address || undefined;
  return {
    "@type": "PostalAddress" as const,
    streetAddress: street,
    addressLocality: city,
    addressRegion: sido,
    addressCountry: "KR",
  };
}

export function buildPlaceJsonLd(
  business: PetBusiness,
  maps: { kakao: string; naver: string },
  categorySlug?: string,
) {
  const base = getSiteUrl();
  const city = sigunguOf(business);
  const sido = sidoOf(business);
  const category = business.category;
  const path = businessPath(business.id);
  const url = absoluteUrl(path);
  const copy = placeCopy(business);

  const schemaType =
    category === "동물병원" || category === "응급병원"
      ? "VeterinaryCare"
      : category === "보호센터"
        ? "AnimalShelter"
        : "LocalBusiness";

  const localBusiness: Record<string, unknown> = {
    "@type": schemaType,
    "@id": `${url}#business`,
    name: business.name,
    url,
    telephone: business.phone || undefined,
    image: absoluteUrl("/kkf/logo.png"),
    description: copy.lead,
    address: parseAddressParts(business),
    areaServed: [
      { "@type": "AdministrativeArea", name: sido },
      { "@type": "City", name: city },
    ],
    hasMap: maps.kakao,
    sameAs: [maps.kakao, maps.naver].filter(Boolean),
    publicAccess: true,
    isAccessibleForFree: true,
  };

  if (business.hours) {
    localBusiness.openingHours = business.hours;
  }
  if (business.status) {
    localBusiness.additionalProperty = [
      { "@type": "PropertyValue", name: "영업상태", value: business.status },
    ];
  }

  const catSlug = categorySlug || "hospital";

  const breadcrumb = {
    "@type": "BreadcrumbList",
    "@id": `${url}#breadcrumb`,
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "업종", item: absoluteUrl("/c") },
      {
        "@type": "ListItem",
        position: 2,
        name: `${sido} ${category}`,
        item: absoluteUrl(categoryPath(catSlug, sido)),
      },
      { "@type": "ListItem", position: 3, name: business.name, item: url },
    ],
  };

  const faqPage = {
    "@type": "FAQPage",
    "@id": `${url}#faq`,
    mainEntity: copy.faqs.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  const webPage = {
    "@type": "WebPage",
    "@id": url,
    url,
    name: `${city} ${business.name}`,
    description: copy.lead,
    isPartOf: { "@id": `${base}/#website` },
    about: { "@id": `${url}#business` },
    inLanguage: "ko-KR",
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: [".place-lead", ".place-intro", "#bxa_qa"],
    },
  };

  return {
    "@context": "https://schema.org",
    "@graph": [localBusiness, breadcrumb, faqPage, webPage],
  };
}

export function buildCategoryJsonLd(opts: {
  category: DirectoryCategory;
  sido?: string;
  total: number;
  sampleNames: string[];
}) {
  const { category, sido, total, sampleNames } = opts;
  const path = categoryPath(category.slug, sido);
  const url = absoluteUrl(path);
  const name = sido ? `${sido} ${category.title}` : `${category.title} 전국`;

  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": url,
    url,
    name,
    description: `${name} ${total.toLocaleString()}곳 — 한국애견연맹 반려문화증진위원회 디렉터리`,
    inLanguage: "ko-KR",
    isPartOf: { "@id": `${getSiteUrl()}/#website` },
    about: { "@type": "Thing", name: category.title },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: total,
      itemListElement: sampleNames.slice(0, 20).map((n, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: n,
      })),
    },
  };
}

/** AI·검색엔진이 인용하기 쉬운 구조화 데이터 */
export function buildHomeJsonLd(kkf?: {
  phone?: string;
  email?: string;
  address?: string;
  siteUrl?: string;
  federationAddress?: string;
  federationEmail?: string;
  committeeAddress?: string;
  committeePhone?: string;
  committeeEmail?: string;
  chairperson?: string;
  operator?: string;
  org?: string;
}) {
  const base = getSiteUrl();
  const orgId = `${base}/#organization`;
  const websiteId = `${base}/#website`;
  const webpageId = `${base}/#webpage`;

  const committeePhone = kkf?.committeePhone || kkf?.phone;
  const committeeEmail = kkf?.committeeEmail || kkf?.email;
  const committeeAddress = kkf?.committeeAddress || kkf?.address;
  const federationAddress = kkf?.federationAddress;
  const federationEmail = kkf?.federationEmail;

  const organization: Record<string, unknown> = {
    "@type": "Organization",
    "@id": orgId,
    name: kkf?.operator || "한국애견연맹 반려문화증진위원회",
    alternateName: ["반려문화증진위원회", "한국애견연맹 반려문화증진위원회 디렉터리", "KKF 반려문화증진위원회"],
    legalName: site.name,
    url: base,
    logo: `${base}/kkf/logo.png`,
    image: `${base}/kkf/logo.png`,
    description: homeSeo.description,
    parentOrganization: {
      "@type": "Organization",
      name: kkf?.org || "사단법인 한국애견연맹",
      alternateName: ["한국애견연맹", "KKF"],
      url: kkf?.siteUrl || site.officialUrl,
      email: federationEmail,
      address: federationAddress
        ? {
            "@type": "PostalAddress",
            streetAddress: federationAddress,
            addressCountry: "KR",
          }
        : undefined,
    },
    areaServed: { "@type": "Country", name: "대한민국" },
    knowsAbout: [
      "한국애견연맹",
      "반려문화증진위원회",
      "반려동물",
      "반려견",
      "동물병원",
      "펫샵",
      "애견미용",
    ],
    sameAs: [kkf?.siteUrl || site.officialUrl],
    contactPoint: [
      committeePhone || committeeEmail
        ? {
            "@type": "ContactPoint",
            contactType: "customer service",
            telephone: committeePhone,
            email: committeeEmail,
            areaServed: "KR",
            availableLanguage: "Korean",
          }
        : null,
      federationEmail
        ? {
            "@type": "ContactPoint",
            contactType: "parent organization",
            email: federationEmail,
            areaServed: "KR",
            availableLanguage: "Korean",
          }
        : null,
    ].filter(Boolean),
  };

  if (kkf?.chairperson) {
    organization.founder = { "@type": "Person", name: kkf.chairperson, jobTitle: "위원장" };
  }
  if (committeePhone) organization.telephone = committeePhone;
  if (committeeEmail) organization.email = committeeEmail;
  if (committeeAddress) {
    organization.address = {
      "@type": "PostalAddress",
      streetAddress: committeeAddress,
      addressLocality: "부천시",
      addressRegion: "경기도",
      addressCountry: "KR",
    };
  }

  const website = {
    "@type": "WebSite",
    "@id": websiteId,
    url: base,
    name: "한국애견연맹 반려문화증진위원회",
    alternateName: ["반려문화증진위원회", "한국애견연맹"],
    description: homeSeo.description,
    inLanguage: "ko-KR",
    publisher: { "@id": orgId },
  };

  const webPage = {
    "@type": "WebPage",
    "@id": webpageId,
    url: base,
    name: homeSeo.title,
    description: homeSeo.description,
    isPartOf: { "@id": websiteId },
    about: [
      { "@type": "Thing", name: "한국애견연맹" },
      { "@type": "Thing", name: "반려문화증진위원회" },
    ],
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: `${base}/kkf/logo.png`,
    },
    inLanguage: "ko-KR",
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: [".aeo-define", ".aeo-define-lead", "#faq"],
    },
  };

  const faqPage = {
    "@type": "FAQPage",
    "@id": `${base}/#faq`,
    mainEntity: faq.items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  return {
    "@context": "https://schema.org",
    "@graph": [organization, website, webPage, faqPage],
  };
}

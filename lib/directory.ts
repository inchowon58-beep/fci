import type { PetBusiness, PetBusinessCategory } from "./public-data";
import { getBusinessById, getRegisteredBusinesses } from "./registry";

export type DirectoryCategory = {
  slug: string;
  title: string;
  icon: string;
  blurb: string;
  match: PetBusinessCategory[];
};

export const DIRECTORY_CATEGORIES: DirectoryCategory[] = [
  {
    slug: "hospital",
    title: "동물병원 · 응급",
    icon: "🩺",
    blurb: "동물병원 · 응급병원 · 야간진료",
    match: ["동물병원", "응급병원"],
  },
  {
    slug: "pharmacy",
    title: "동물약국",
    icon: "💉",
    blurb: "동물약국 · 동물용의약품",
    match: ["동물약국"],
  },
  {
    slug: "shop",
    title: "펫샵 · 판매",
    icon: "🦴",
    blurb: "펫샵 · 동물판매 · 생산 · 수입 · 의료용구",
    match: ["펫샵", "용품"],
  },
  {
    slug: "grooming",
    title: "미용",
    icon: "🪮",
    blurb: "애견미용 · 고양이미용",
    match: ["미용"],
  },
  {
    slug: "hotel",
    title: "호텔 · 펜션",
    icon: "🏡",
    blurb: "펫호텔 · 위탁관리 · 데이케어",
    match: ["호텔·펜션"],
  },
  {
    slug: "cafe",
    title: "카페",
    icon: "🥛",
    blurb: "펫카페 · 동반카페",
    match: ["카페"],
  },
  {
    slug: "training",
    title: "훈련",
    icon: "🦮",
    blurb: "훈련소 · 행동교정",
    match: ["훈련소"],
  },
  {
    slug: "sitter",
    title: "시터 · 산책",
    icon: "🐕",
    blurb: "펫시터 · 산책대행",
    match: ["시터"],
  },
  {
    slug: "funeral",
    title: "장묘",
    icon: "🌸",
    blurb: "동물장묘 · 화장 · 봉안",
    match: ["장묘"],
  },
  {
    slug: "shelter",
    title: "보호센터",
    icon: "🛟",
    blurb: "동물보호센터 · 구조",
    match: ["보호센터"],
  },
  {
    slug: "culture",
    title: "동반시설",
    icon: "🌳",
    blurb: "공원 · 관광 · 박물관 · 동반 가능 장소",
    match: ["동반시설"],
  },
  {
    slug: "exhibition",
    title: "전시",
    icon: "🎪",
    blurb: "동물전시 · 체험 · 관람",
    match: ["전시"],
  },
  {
    slug: "regist",
    title: "등록대행",
    icon: "🪪",
    blurb: "반려동물 등록 · 마이크로칩 대행",
    match: ["등록대행"],
  },
  {
    slug: "transport",
    title: "운송",
    icon: "🚐",
    blurb: "반려동물 운송 · 이동 서비스",
    match: ["운송"],
  },
];

/** 카테고리 목록 페이지당 카드 수 */
export const CATEGORY_PAGE_SIZE = 48;
/** 전국 보기에서 시·도별 미리보기 개수 */
export const CATEGORY_PREVIEW_PER_SIDO = 6;

export function businessPath(id: string) {
  return `/place/${encodeURIComponent(id)}`;
}

export function sigunguOf(business: Pick<PetBusiness, "region">) {
  const parts = business.region.trim().split(/\s+/).filter(Boolean);
  return parts[1] || parts[0] || "지역";
}

export function categoryPath(slug: string, sido?: string, page?: number) {
  const base = sido ? `/c/${slug}/${encodeURIComponent(sido)}` : `/c/${slug}`;
  const params = new URLSearchParams();
  if (page && page > 1) params.set("page", String(page));
  const q = params.toString();
  return q ? `${base}?${q}` : base;
}

export function sidoOf(business: Pick<PetBusiness, "region">) {
  const first = business.region.trim().split(/\s+/)[0];
  return first || "지역 미상";
}

export function getCategory(slug: string) {
  return DIRECTORY_CATEGORIES.find((c) => c.slug === slug);
}

export function categoryOfBusiness(business: PetBusiness) {
  return DIRECTORY_CATEGORIES.find((c) => c.match.includes(business.category));
}

export function filterByCategory(list: PetBusiness[], category: DirectoryCategory) {
  const set = new Set(category.match);
  return list.filter((b) => set.has(b.category));
}

export function groupBySido(list: PetBusiness[]) {
  const map = new Map<string, PetBusiness[]>();
  for (const item of list) {
    const sido = sidoOf(item);
    const bucket = map.get(sido);
    if (bucket) bucket.push(item);
    else map.set(sido, [item]);
  }
  return [...map.entries()]
    .map(([sido, items]) => ({
      sido,
      items: items.sort((a, b) => a.name.localeCompare(b.name, "ko")),
    }))
    .sort((a, b) => a.sido.localeCompare(b.sido, "ko"));
}

export async function getBusiness(id: string) {
  return getBusinessById(id);
}

export async function getCategoryListing(
  slug: string,
  opts?: { sido?: string; page?: number },
) {
  const category = getCategory(slug);
  if (!category) return null;

  const all = await getRegisteredBusinesses();
  const matched = filterByCategory(all, category);
  const groupsAll = groupBySido(matched);
  const sidos = groupsAll.map((g) => ({ sido: g.sido, count: g.items.length }));
  const selectedSido = opts?.sido;
  const page = Math.max(1, opts?.page || 1);

  if (selectedSido) {
    const group = groupsAll.find((g) => g.sido === selectedSido);
    const items = group?.items ?? [];
    const pageCount = Math.max(1, Math.ceil(items.length / CATEGORY_PAGE_SIZE));
    const safePage = Math.min(page, pageCount);
    const start = (safePage - 1) * CATEGORY_PAGE_SIZE;
    const pageItems = items.slice(start, start + CATEGORY_PAGE_SIZE);

    return {
      category,
      total: matched.length,
      mode: "sido" as const,
      groups: [{ sido: selectedSido, items: pageItems, totalInSido: items.length }],
      sidos,
      selectedSido,
      page: safePage,
      pageCount,
      shown: pageItems.length,
    };
  }

  const previewGroups = groupsAll.map((g) => ({
    sido: g.sido,
    items: g.items.slice(0, CATEGORY_PREVIEW_PER_SIDO),
    totalInSido: g.items.length,
  }));

  return {
    category,
    total: matched.length,
    mode: "preview" as const,
    groups: previewGroups,
    sidos,
    selectedSido: undefined as string | undefined,
    page: 1,
    pageCount: 1,
    shown: previewGroups.reduce((n, g) => n + g.items.length, 0),
  };
}

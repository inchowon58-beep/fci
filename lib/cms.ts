import { promises as fs } from "fs";
import path from "path";

/** 상세페이지 제휴·파트너 슬롯 */
export type PartnerSlot = {
  active: boolean;
  name: string;
  phone?: string;
  homepage?: string;
  kakao?: string;
  intro?: string;
  banner?: string;
  badge?: string;
};

export type NoticeItem = {
  id: string;
  title: string;
  date?: string;
  href?: string;
  pinned?: boolean;
};

export type KkfInfo = {
  /** 사단법인 한국애견연맹 */
  org: string;
  /** 운영 표기 */
  operator: string;
  /** 위원장 */
  chairperson: string;
  /** 한국애견연맹 주소 */
  federationAddress: string;
  /** 한국애견연맹 이메일 */
  federationEmail: string;
  /** 반려문화증진위원회 주소 */
  committeeAddress: string;
  /** 반려문화증진위원회 전화 */
  committeePhone: string;
  /** 반려문화증진위원회 이메일 */
  committeeEmail: string;
  /** 하위 호환: 위원회 연락처 (알림판·SEO) */
  phone: string;
  email: string;
  address: string;
  siteUrl: string;
  blurb: string;
  links: { label: string; href: string }[];
  dogShows: { title: string; status: string }[];
};

export type CmsFile = {
  updatedAt: string;
  /** 제휴 슬롯 3개 (알림판 제외) */
  partners: PartnerSlot[];
  notices: NoticeItem[];
  kkf: KkfInfo;
};

const FILE = path.join(process.cwd(), "data", "cms.json");

export const EMPTY_PARTNER: PartnerSlot = {
  active: false,
  name: "",
  phone: "",
  homepage: "",
  kakao: "",
  intro: "",
  banner: "",
  badge: "",
};

const EMPTY: CmsFile = {
  updatedAt: "",
  partners: [{ ...EMPTY_PARTNER }, { ...EMPTY_PARTNER }, { ...EMPTY_PARTNER }],
  notices: [],
  kkf: {
    org: "사단법인 한국애견연맹",
    operator: "한국애견연맹 반려문화증진위원회",
    chairperson: "조춘원",
    federationAddress: "서울 도봉구 도봉로 169나길 6 [KKF 빌딩] (우: 01306)",
    federationEmail: "thekkf@thekkf.or.kr",
    committeeAddress: "부천시 원미구 상동",
    committeePhone: "010-2374-0401",
    committeeEmail: "inchowon58@gmail.com",
    phone: "010-2374-0401",
    email: "inchowon58@gmail.com",
    address: "부천시 원미구 상동",
    siteUrl: "https://www.thekkf.or.kr/new_home/main.php",
    blurb: "",
    links: [],
    dogShows: [],
  },
};

function normalizePartner(raw: unknown): PartnerSlot {
  const p = (raw || {}) as Partial<PartnerSlot> & {
    title?: string;
    blurb?: string;
    href?: string;
    image?: string;
  };
  return {
    active: Boolean(p.active),
    name: String(p.name || p.title || ""),
    phone: String(p.phone || ""),
    homepage: String(p.homepage || p.href || ""),
    kakao: String(p.kakao || ""),
    intro: String(p.intro || p.blurb || ""),
    banner: String(p.banner || p.image || ""),
    badge: String(p.badge || ""),
  };
}

function normalizePartners(parsed: {
  partners?: PartnerSlot[] | { large?: unknown; small?: unknown };
  ads?: { large?: unknown; small?: unknown[] };
}): PartnerSlot[] {
  if (Array.isArray(parsed.partners)) {
    const list = parsed.partners.map(normalizePartner);
    while (list.length < 3) list.push({ ...EMPTY_PARTNER });
    return list.slice(0, 3);
  }

  // 구 large/small 형식
  if (parsed.partners && !Array.isArray(parsed.partners)) {
    const legacy = parsed.partners as { large?: unknown; small?: unknown };
    return [
      normalizePartner(legacy.large),
      normalizePartner(legacy.small),
      { ...EMPTY_PARTNER },
    ];
  }

  if (parsed.ads) {
    return [
      normalizePartner(parsed.ads.large),
      normalizePartner(parsed.ads.small?.[0]),
      normalizePartner(parsed.ads.small?.[1]),
    ];
  }

  return [{ ...EMPTY_PARTNER }, { ...EMPTY_PARTNER }, { ...EMPTY_PARTNER }];
}

export async function readCms(): Promise<CmsFile> {
  try {
    const raw = await fs.readFile(FILE, "utf8");
    const parsed = JSON.parse(raw) as Partial<CmsFile> & {
      ads?: { large?: unknown; small?: unknown[] };
      partners?: PartnerSlot[] | { large?: unknown; small?: unknown };
    };

    const kkf = { ...EMPTY.kkf, ...(parsed.kkf || {}) };
    // 하위 호환·일관성: phone/email/address는 위원회 연락처로 맞춤
    kkf.phone = kkf.committeePhone || kkf.phone;
    kkf.email = kkf.committeeEmail || kkf.email;
    kkf.address = kkf.committeeAddress || kkf.address;
    kkf.operator = kkf.operator || EMPTY.kkf.operator;
    kkf.chairperson = kkf.chairperson || EMPTY.kkf.chairperson;
    kkf.federationAddress = kkf.federationAddress || EMPTY.kkf.federationAddress;
    kkf.federationEmail = kkf.federationEmail || EMPTY.kkf.federationEmail;
    kkf.committeeAddress = kkf.committeeAddress || EMPTY.kkf.committeeAddress;
    kkf.committeePhone = kkf.committeePhone || EMPTY.kkf.committeePhone;
    kkf.committeeEmail = kkf.committeeEmail || EMPTY.kkf.committeeEmail;

    return {
      ...EMPTY,
      ...parsed,
      partners: normalizePartners(parsed),
      notices: parsed.notices || [],
      kkf,
    };
  } catch {
    return { ...EMPTY };
  }
}

export async function writeCms(next: Omit<CmsFile, "updatedAt">): Promise<CmsFile> {
  if (process.env.VERCEL) {
    throw new Error(
      "Vercel에서는 cms.json 쓰기가 유지되지 않습니다. 로컬에서 수정 후 커밋·배포하세요.",
    );
  }
  const payload: CmsFile = {
    ...next,
    partners: normalizePartners({ partners: next.partners }),
    updatedAt: new Date().toISOString(),
  };
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(payload, null, 2), "utf8");
  return payload;
}

export function activePartners(cms: CmsFile): (PartnerSlot | null)[] {
  const list = Array.isArray(cms.partners) ? cms.partners : [];
  while (list.length < 3) list.push({ ...EMPTY_PARTNER });
  return list.slice(0, 3).map((p) => (p.active ? p : null));
}

export function sortedNotices(cms: CmsFile, limit = 6) {
  return [...(cms.notices || [])]
    .sort((a, b) => Number(Boolean(b.pinned)) - Number(Boolean(a.pinned)))
    .slice(0, limit);
}

/**
 * 공공데이터포털(data.go.kr) 연동
 * 인증키는 .env.local 의 PUBLIC_DATA_API_KEY
 */

export type PetBusinessCategory =
  | "동물병원"
  | "동물약국"
  | "펫샵"
  | "미용"
  | "호텔·펜션"
  | "카페"
  | "훈련소"
  | "시터"
  | "용품"
  | "응급병원"
  | "장묘"
  | "보호센터"
  | "동반시설"
  | "전시"
  | "등록대행"
  | "운송";

export interface PetBusiness {
  id: string;
  name: string;
  category: PetBusinessCategory;
  region: string;
  address?: string;
  phone?: string;
  hours?: string;
  parking?: boolean;
  emergency?: boolean;
  updatedAt?: string;
  status?: string;
  source?: string;
  sourceId?: string;
  licensedAt?: string;
}

export interface AbandonedNotice {
  id: string;
  kind: string;
  place: string;
  careNm: string;
  happenDt?: string;
  processState?: string;
  sex?: string;
  age?: string;
}

export interface DatasetDef {
  id: string;
  name: string;
  category: PetBusinessCategory | "유기동물" | "동반시설" | "전시" | "등록대행" | "운송";
  path: string;
  kind: "license" | "shelter" | "abandon" | "cultureCsv" | "registAgency";
  applyUrl: string;
  /** 페이지당 요청 건수 (포털 상한에 맞춤) */
  pageSize: number;
}

export interface DatasetProbe {
  id: string;
  name: string;
  ok: boolean;
  status: number;
  totalCount?: number;
  message: string;
  applyUrl: string;
}

export interface ImportStep {
  at: string;
  level: "info" | "ok" | "warn" | "error";
  message: string;
  datasetId?: string;
  businessId?: string;
}

/** 한 번에 전부 가져옵니다. limit 으로 자르지 않습니다. */
export const DATASETS: DatasetDef[] = [
  {
    id: "hospital",
    name: "동물병원",
    category: "동물병원",
    path: "/1741000/animal_hospitals/info",
    kind: "license",
    applyUrl: "https://www.data.go.kr/data/15154952/openapi.do",
    pageSize: 100,
  },
  {
    id: "pharmacy",
    name: "동물약국",
    category: "동물약국",
    path: "/1741000/animal_pharmacies/info",
    kind: "license",
    applyUrl: "https://www.data.go.kr/data/15155272/openapi.do",
    pageSize: 100,
  },
  {
    id: "medEquip",
    name: "동물용의료용구판매업",
    category: "용품",
    path: "/1741000/veterinary_medical_equipment_sales/info",
    kind: "license",
    applyUrl: "https://www.data.go.kr/data/15154971/openapi.do",
    pageSize: 100,
  },
  {
    id: "grooming",
    name: "동물미용업",
    category: "미용",
    path: "/1741000/pet_grooming/info",
    kind: "license",
    applyUrl: "https://www.data.go.kr/data/15154944/openapi.do",
    pageSize: 100,
  },
  {
    id: "boarding",
    name: "동물위탁관리업",
    category: "호텔·펜션",
    path: "/1741000/animal_boarding/info",
    kind: "license",
    applyUrl: "https://www.data.go.kr/data/15121110/fileData.do",
    pageSize: 100,
  },
  {
    id: "cremation",
    name: "동물장묘업",
    category: "장묘",
    path: "/1741000/animal_cremation/info",
    kind: "license",
    applyUrl: "https://www.data.go.kr/data/15155065/openapi.do",
    pageSize: 100,
  },
  {
    id: "exhibition",
    name: "동물전시업",
    category: "전시",
    path: "/1741000/animal_exhibition/info",
    kind: "license",
    applyUrl: "https://www.data.go.kr/data/15155075/openapi.do",
    pageSize: 100,
  },
  {
    id: "sales",
    name: "동물판매업",
    category: "펫샵",
    path: "/1741000/animal_sales/info",
    kind: "license",
    applyUrl: "https://www.data.go.kr/data/15155083/openapi.do",
    pageSize: 100,
  },
  {
    id: "import",
    name: "동물수입업",
    category: "펫샵",
    path: "/1741000/animal_import/info",
    kind: "license",
    applyUrl: "https://www.data.go.kr/data/15154961/openapi.do",
    pageSize: 100,
  },
  {
    id: "breeding",
    name: "동물생산업",
    category: "펫샵",
    path: "/1741000/animal_breeding/info",
    kind: "license",
    applyUrl: "https://www.data.go.kr/data/15154957/openapi.do",
    pageSize: 100,
  },
  {
    id: "transport",
    name: "동물운송업",
    category: "운송",
    path: "/1741000/animal_transport/info",
    kind: "license",
    applyUrl: "https://www.data.go.kr/data/15155024/openapi.do",
    pageSize: 100,
  },
  {
    id: "shelter",
    name: "동물보호센터",
    category: "보호센터",
    path: "/1543061/animalShelterSrvc_v2/shelterInfo_v2",
    kind: "shelter",
    applyUrl: "https://www.data.go.kr/data/15098915/openapi.do",
    pageSize: 100,
  },
  {
    id: "registAgency",
    name: "반려동물 등록대행",
    category: "등록대행",
    path: "/1543061/recordAgencySrvc_v2/recordAgency_v2",
    kind: "registAgency",
    applyUrl: "https://www.data.go.kr/data/15098916/openapi.do",
    pageSize: 100,
  },
  {
    id: "abandon",
    name: "유기동물 공고",
    category: "유기동물",
    path: "/1543061/abandonmentPublicService_v2/abandonmentPublic_v2",
    kind: "abandon",
    applyUrl: "https://www.data.go.kr/data/15098931/openapi.do",
    pageSize: 100,
  },
  {
    id: "culture",
    name: "반려동물 동반 문화시설",
    category: "동반시설",
    path: "data/raw/pet-culture-facilities.csv",
    kind: "cultureCsv",
    applyUrl: "https://www.data.go.kr/data/15111389/fileData.do",
    pageSize: 0,
  },
];

export function maskApiKey(key: string) {
  if (key.length < 12) return "••••";
  return `${key.slice(0, 6)}…${key.slice(-4)}`;
}

export function getApiKey() {
  return process.env.PUBLIC_DATA_API_KEY?.trim() ?? "";
}

function baseUrl() {
  return (process.env.PUBLIC_DATA_BASE_URL ?? "https://apis.data.go.kr").replace(/\/$/, "");
}

function asArray<T>(value: T | T[] | undefined | null): T[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function regionFromAddress(address?: string) {
  if (!address) return "지역 미상";
  const parts = address.trim().split(/\s+/).filter(Boolean);
  return parts.slice(0, 2).join(" ") || "지역 미상";
}

function isOpenLicense(row: Record<string, unknown>) {
  const code = String(row.SALS_STTS_CD ?? "");
  const name = String(row.SALS_STTS_NM ?? "");
  const detail = String(row.DTL_SALS_STTS_NM ?? "");
  // 영업중 필터를 API에서 걸어도, 응답에 혼입되면 한 번 더 거름
  if (!code && !name && !detail) return true;
  return code === "01" || name.includes("영업") || detail === "정상";
}

function looksEmergency(name: string) {
  return /응급|24시|24시간|야간/.test(name);
}

function pickPhone(row: Record<string, unknown>) {
  const raw = String(row.TELNO ?? row.careTel ?? row.officetel ?? "").trim();
  return raw && raw !== "0" ? raw : undefined;
}

function mapLicense(row: Record<string, unknown>, dataset: DatasetDef): PetBusiness | null {
  if (dataset.category === "유기동물") return null;
  const name = String(row.BPLC_NM ?? "").trim();
  if (!name) return null;
  const address = String(row.ROAD_NM_ADDR || row.LOTNO_ADDR || "").trim();
  const category = dataset.category as PetBusinessCategory;
  const emergency = category === "동물병원" && looksEmergency(name);
  return {
    id: `${dataset.id}-${String(row.MNG_NO ?? name)}`,
    name,
    category: emergency ? "응급병원" : category,
    region: regionFromAddress(address),
    address: address || undefined,
    phone: pickPhone(row),
    status: String(row.SALS_STTS_NM || row.DTL_SALS_STTS_NM || "").trim() || undefined,
    updatedAt: String(row.DAT_UPDT_PNT || "").trim() || undefined,
    licensedAt: String(row.LCPMT_YMD || "").trim() || undefined,
    emergency,
    source: dataset.name,
    sourceId: String(row.MNG_NO ?? ""),
  };
}

function mapShelter(row: Record<string, unknown>): PetBusiness | null {
  const name = String(row.careNm ?? "").trim();
  if (!name) return null;
  const address = String(row.careAddr ?? row.jibunAddr ?? "").trim();
  return {
    id: `shelter-${String(row.careRegNo ?? name)}`,
    name,
    category: "보호센터",
    region: String(row.orgNm ?? regionFromAddress(address)).trim() || "지역 미상",
    address: address || undefined,
    phone: pickPhone(row),
    hours:
      String(row.weekOprStime && row.weekOprEtime ? `${row.weekOprStime}–${row.weekOprEtime}` : "").trim() ||
      undefined,
    source: "동물보호센터",
    sourceId: String(row.careRegNo ?? ""),
  };
}

function mapRegistAgency(row: Record<string, unknown>): PetBusiness | null {
  const name = String(row.orgNm ?? "").trim();
  if (!name) return null;
  const address = [String(row.orgAddr ?? "").trim(), String(row.orgAddrDtl ?? "").trim()]
    .filter(Boolean)
    .join(" ");
  const phone = String(row.tel ?? "").trim();
  return {
    id: `regist-${Buffer.from(`${name}|${address}`).toString("base64url").slice(0, 28)}`,
    name,
    category: "등록대행",
    region: regionFromAddress(address),
    address: address || undefined,
    phone: phone && phone !== "0" ? phone : undefined,
    status: "등록대행",
    source: "반려동물 등록대행",
    sourceId: `${name}|${address}`.slice(0, 120),
  };
}

function mapAbandon(row: Record<string, unknown>): AbandonedNotice | null {
  const id = String(row.desertionNo ?? "").trim();
  if (!id) return null;
  return {
    id,
    kind: String(row.kindFullNm || row.kindCd || "미상").trim(),
    place: String(row.happenPlace || row.orgNm || "").trim(),
    careNm: String(row.careNm || "").trim(),
    happenDt: String(row.happenDt || "").trim() || undefined,
    processState: String(row.processState || "").trim() || undefined,
    sex: String(row.sexCd || "").trim() || undefined,
    age: String(row.age || "").trim() || undefined,
  };
}

type PortalJson = {
  response?: {
    header?: { resultCode?: string; resultMsg?: string };
    body?: {
      items?: { item?: Record<string, unknown> | Record<string, unknown>[] };
      totalCount?: number | string;
      pageNo?: number | string;
      numOfRows?: number | string;
    };
  };
  OpenAPI_ServiceResponse?: {
    cmmMsgHeader?: { errMsg?: string; returnAuthMsg?: string; returnReasonCode?: string };
  };
};

function portalError(json: PortalJson) {
  const header = json.OpenAPI_ServiceResponse?.cmmMsgHeader;
  if (header?.returnAuthMsg || header?.errMsg) {
    return header.returnAuthMsg || header.errMsg || "포털 오류";
  }
  const code = json.response?.header?.resultCode;
  if (code && code !== "00" && code !== "0") {
    return json.response?.header?.resultMsg || `결과코드 ${code}`;
  }
  return "";
}

async function callPortal(
  dataset: DatasetDef,
  pageNo: number,
  rows: number,
): Promise<{
  status: number;
  json: PortalJson;
  items: Record<string, unknown>[];
  totalCount: number;
  message: string;
}> {
  const key = getApiKey();
  if (!key) {
    return { status: 0, json: {}, items: [], totalCount: 0, message: "PUBLIC_DATA_API_KEY 없음" };
  }

  const url = new URL(`${baseUrl()}${dataset.path}`);
  url.searchParams.set("serviceKey", key);
  url.searchParams.set("pageNo", String(pageNo));
  url.searchParams.set("numOfRows", String(rows));
  if (dataset.kind === "license") {
    url.searchParams.set("returnType", "json");
    url.searchParams.set("cond[SALS_STTS_CD::EQ]", "01");
  } else {
    url.searchParams.set("_type", "json");
  }

  const res = await fetch(url.toString(), {
    cache: "no-store",
    headers: { Accept: "application/json" },
  });
  const json = (await res.json().catch(() => ({}))) as PortalJson;
  const err = portalError(json);
  const items = asArray(json.response?.body?.items?.item);
  const totalCount = Number(json.response?.body?.totalCount ?? items.length) || 0;
  return {
    status: res.status,
    json,
    items,
    totalCount,
    message: err || (res.ok ? "정상" : `HTTP ${res.status}`),
  };
}

/** 페이지를 돌며 해당 데이터셋 전체를 수집 */
async function fetchAllPages(
  dataset: DatasetDef,
  onPage?: (info: { pageNo: number; got: number; total: number; pages: number }) => void,
): Promise<{
  status: number;
  items: Record<string, unknown>[];
  totalCount: number;
  message: string;
  pages: number;
}> {
  // 유기동물 공고는 피드 — 1페이지만
  const maxPages = dataset.kind === "abandon" ? 1 : 500;

  let pageSize = Math.max(1, dataset.pageSize);
  let first = await callPortal(dataset, 1, pageSize);
  // 일부 API는 numOfRows 상한이 100
  if ((first.status !== 200 || portalError(first.json)) && pageSize > 100) {
    pageSize = 100;
    first = await callPortal(dataset, 1, pageSize);
  }

  const err = portalError(first.json);
  if (first.status !== 200 || err) {
    return {
      status: first.status,
      items: [],
      totalCount: first.totalCount,
      message: first.message,
      pages: 0,
    };
  }

  const totalCount = first.totalCount || first.items.length;
  // 요청은 1000이어도 포털이 100만 주는 경우가 있음 → 실제 수신 건수로 페이지 계산
  const effectivePageSize = Math.max(1, first.items.length || Math.min(pageSize, 100));
  const pages = Math.min(Math.max(1, Math.ceil(totalCount / effectivePageSize)), maxPages);
  const items = [...first.items];
  onPage?.({ pageNo: 1, got: items.length, total: totalCount, pages });

  for (let pageNo = 2; pageNo <= pages; pageNo += 1) {
    const hit = await callPortal(dataset, pageNo, effectivePageSize);
    const pageErr = portalError(hit.json);
    if (hit.status !== 200 || pageErr) {
      return {
        status: hit.status,
        items,
        totalCount,
        message: `${pageNo}페이지 중단: ${hit.message}`,
        pages: pageNo - 1,
      };
    }
    if (hit.items.length === 0) break;
    items.push(...hit.items);
    onPage?.({ pageNo, got: items.length, total: totalCount, pages });
    if (items.length >= totalCount) break;
  }

  return {
    status: 200,
    items,
    totalCount,
    message: "정상",
    pages,
  };
}

export async function probeDatasets(): Promise<DatasetProbe[]> {
  const results: DatasetProbe[] = [];
  for (const dataset of DATASETS) {
    try {
      if (dataset.kind === "cultureCsv") {
        const { ensurePetCultureCsv } = await import("./pet-culture");
        const file = await ensurePetCultureCsv();
        results.push({
          id: dataset.id,
          name: dataset.name,
          ok: file.bytes > 0,
          status: 200,
          totalCount: undefined,
          message: `CSV ${(file.bytes / 1_000_000).toFixed(1)}MB · ${file.source}`,
          applyUrl: dataset.applyUrl,
        });
        continue;
      }
      const hit = await callPortal(dataset, 1, 1);
      const ok = hit.status === 200 && !portalError(hit.json);
      results.push({
        id: dataset.id,
        name: dataset.name,
        ok,
        status: hit.status,
        totalCount: hit.totalCount,
        message: ok ? `포털 ${hit.totalCount.toLocaleString()}건` : hit.message,
        applyUrl: dataset.applyUrl,
      });
    } catch (error) {
      results.push({
        id: dataset.id,
        name: dataset.name,
        ok: false,
        status: 0,
        message: error instanceof Error ? error.message : "호출 실패",
        applyUrl: dataset.applyUrl,
      });
    }
  }
  return results;
}

export async function importFromPortal(opts?: { datasetIds?: string[] }): Promise<{
  steps: ImportStep[];
  businesses: PetBusiness[];
  notices: AbandonedNotice[];
  probes: DatasetProbe[];
  /** 부분 수집 시 true — 기존 레지스트리와 병합해야 함 */
  partial: boolean;
}> {
  const steps: ImportStep[] = [];
  const businesses: PetBusiness[] = [];
  const notices: AbandonedNotice[] = [];
  const probes: DatasetProbe[] = [];
  const seen = new Set<string>();
  const seenFinger = new Set<string>();
  const now = () => new Date().toISOString();
  const { fingerprintBusiness, loadPetCultureFacilities } = await import("./pet-culture");
  const filterIds = opts?.datasetIds?.filter(Boolean);
  const datasets = filterIds?.length
    ? DATASETS.filter((d) => filterIds.includes(d.id))
    : DATASETS;
  const partial = Boolean(filterIds?.length);

  const key = getApiKey();
  if (!key) {
    steps.push({ at: now(), level: "error", message: ".env.local 에 PUBLIC_DATA_API_KEY 가 없습니다." });
    return { steps, businesses, notices, probes, partial };
  }

  if (partial && datasets.length === 0) {
    steps.push({
      at: now(),
      level: "error",
      message: `알 수 없는 데이터셋: ${(filterIds || []).join(", ")}`,
    });
    return { steps, businesses, notices, probes, partial };
  }

  steps.push({
    at: now(),
    level: "ok",
    message: partial
      ? `인증키 등록 확인 (${maskApiKey(key)}) · 선택 수집 (${datasets.map((d) => d.name).join(", ")})`
      : `인증키 등록 확인 (${maskApiKey(key)}) · 전건 수집 모드`,
  });

  for (const dataset of datasets) {
    steps.push({
      at: now(),
      level: "info",
      datasetId: dataset.id,
      message: `${dataset.name} 전건 수집 시작… ${dataset.path}`,
    });

    try {
      if (dataset.kind === "cultureCsv") {
        const loaded = await loadPetCultureFacilities();
        probes.push({
          id: dataset.id,
          name: dataset.name,
          ok: loaded.businesses.length > 0,
          status: 200,
          totalCount: loaded.totalRows,
          message: `CSV ${loaded.totalRows.toLocaleString()}행 · 동반가능 ${loaded.companionRows.toLocaleString()}건`,
          applyUrl: dataset.applyUrl,
        });

        let added = 0;
        let skipped = 0;
        let sampleLogged = 0;
        for (const mapped of loaded.businesses) {
          const finger = fingerprintBusiness(mapped.name, mapped.address);
          if (seen.has(mapped.id) || seenFinger.has(finger)) {
            skipped += 1;
            continue;
          }
          seen.add(mapped.id);
          seenFinger.add(finger);
          businesses.push(mapped);
          added += 1;
          if (sampleLogged < 5) {
            sampleLogged += 1;
            steps.push({
              at: now(),
              level: "ok",
              datasetId: dataset.id,
              businessId: mapped.id,
              message: `등록 예시 · ${mapped.category} · ${mapped.name} · ${mapped.region}`,
            });
          }
        }

        steps.push({
          at: now(),
          level: added > 0 ? "ok" : "warn",
          datasetId: dataset.id,
          message: `${dataset.name} 등록 ${added.toLocaleString()}곳${skipped ? ` · 중복/제외 ${skipped.toLocaleString()}` : ""} (동반가능 ${loaded.companionRows.toLocaleString()} / 전체 ${loaded.totalRows.toLocaleString()})`,
        });
        continue;
      }

      const hit = await fetchAllPages(dataset, ({ pageNo, got, total, pages }) => {
        steps.push({
          at: now(),
          level: "info",
          datasetId: dataset.id,
          message: `${dataset.name} ${pageNo}/${pages}페이지 · 수신 ${got.toLocaleString()}/${total.toLocaleString()}`,
        });
      });

      const ok = hit.status === 200 && hit.message === "정상";
      probes.push({
        id: dataset.id,
        name: dataset.name,
        ok: ok || hit.items.length > 0,
        status: hit.status,
        totalCount: hit.totalCount,
        message:
          hit.items.length > 0
            ? `포털 ${hit.totalCount.toLocaleString()}건 · 수신 ${hit.items.length.toLocaleString()}건`
            : hit.message,
        applyUrl: dataset.applyUrl,
      });

      if (hit.items.length === 0) {
        steps.push({
          at: now(),
          level: hit.message.includes("등록되지 않은 서비스키") ? "warn" : "error",
          datasetId: dataset.id,
          message: `${dataset.name}: ${hit.message}. 포털에서 이 데이터셋 활용신청이 필요할 수 있습니다.`,
        });
        continue;
      }

      if (!ok && hit.items.length > 0) {
        steps.push({
          at: now(),
          level: "warn",
          datasetId: dataset.id,
          message: `${dataset.name}: ${hit.message} (부분 수집 ${hit.items.length.toLocaleString()}건)`,
        });
      }

      if (dataset.kind === "abandon") {
        // 공고는 매일 바뀌는 피드 — 업체 전건과 달리 최근 수신분만 보관
        const mapped = hit.items
          .map(mapAbandon)
          .filter((x): x is AbandonedNotice => Boolean(x))
          .slice(0, dataset.pageSize);
        const unique: AbandonedNotice[] = [];
        const noticeSeen = new Set<string>();
        for (const n of mapped) {
          if (noticeSeen.has(n.id)) continue;
          noticeSeen.add(n.id);
          unique.push(n);
        }
        notices.push(...unique);
        steps.push({
          at: now(),
          level: "ok",
          datasetId: dataset.id,
          message: `${dataset.name} 최근 ${unique.length.toLocaleString()}건 수신 (업체 등록이 아니라 공고 피드 · 포털 ${hit.totalCount.toLocaleString()}건)`,
        });
        continue;
      }

      const rows = dataset.kind === "license" ? hit.items.filter(isOpenLicense) : hit.items;
      let added = 0;
      let skipped = 0;
      let sampleLogged = 0;
      for (const row of rows) {
        const mapped =
          dataset.kind === "shelter"
            ? mapShelter(row)
            : dataset.kind === "registAgency"
              ? mapRegistAgency(row)
              : mapLicense(row, dataset);
        if (!mapped) {
          skipped += 1;
          continue;
        }
        if (seen.has(mapped.id)) {
          skipped += 1;
          continue;
        }
        seen.add(mapped.id);
        seenFinger.add(fingerprintBusiness(mapped.name, mapped.address));
        businesses.push(mapped);
        added += 1;
        if (sampleLogged < 5) {
          sampleLogged += 1;
          steps.push({
            at: now(),
            level: "ok",
            datasetId: dataset.id,
            businessId: mapped.id,
            message: `등록 예시 · ${mapped.category} · ${mapped.name} · ${mapped.region}`,
          });
        }
      }

      steps.push({
        at: now(),
        level: added > 0 ? "ok" : "warn",
        datasetId: dataset.id,
        message: `${dataset.name} 등록 ${added.toLocaleString()}곳${skipped ? ` · 중복/제외 ${skipped.toLocaleString()}` : ""} (포털 ${hit.totalCount.toLocaleString()}건)`,
      });
    } catch (error) {
      probes.push({
        id: dataset.id,
        name: dataset.name,
        ok: false,
        status: 0,
        message: error instanceof Error ? error.message : "호출 실패",
        applyUrl: dataset.applyUrl,
      });
      steps.push({
        at: now(),
        level: "error",
        datasetId: dataset.id,
        message: `${dataset.name} 실패: ${error instanceof Error ? error.message : "알 수 없는 오류"}`,
      });
    }
  }

  steps.push({
    at: now(),
    level: "ok",
    message: `등록 완료 · 업체 ${businesses.length.toLocaleString()}곳 · 유기동물 공고 ${notices.length.toLocaleString()}건`,
  });

  return { steps, businesses, notices, probes, partial };
}

export const PLACEHOLDER_BUSINESSES: PetBusiness[] = [];

export const PUBLIC_DATA_TODO = {
  envKeys: ["PUBLIC_DATA_API_KEY", "PUBLIC_DATA_BASE_URL", "PUBLIC_DATA_PET_CULTURE_CSV_URL"],
  portal: "https://www.data.go.kr/",
  datasetsToPrepare: DATASETS.map((d) => d.name),
} as const;

/**
 * 한국문화정보원 — 전국 반려동물 동반 가능 문화시설 위치 데이터 (CSV 파일데이터)
 * https://www.data.go.kr/data/15111389/fileData.do
 */
import { promises as fs } from "fs";
import path from "path";
import type { PetBusiness, PetBusinessCategory } from "./public-data";

const LOCAL_CSV = path.join(process.cwd(), "data", "raw", "pet-culture-facilities.csv");

/** 포털 원문과 동일한 20250324 CSV (파일데이터 · OpenAPI REST 아님) */
const DEFAULT_CSV_URL =
  process.env.PUBLIC_DATA_PET_CULTURE_CSV_URL?.trim() ||
  "https://raw.githubusercontent.com/SKNETWORKS-FAMILY-AICAMP/SKN23-FINAL-3Team/main/data/raw/%ED%95%9C%EA%B5%AD%EB%AC%B8%ED%99%94%EC%A0%95%EB%B3%B4%EC%9B%90_%EC%A0%84%EA%B5%AD_%EB%B0%98%EB%A0%A4%EB%8F%99%EB%AC%BC_%EB%8F%99%EB%B0%98_%EA%B0%80%EB%8A%A5_%EB%AC%B8%ED%99%94%EC%8B%9C%EC%84%A4_%EC%9C%84%EC%B9%98_%EB%8D%B0%EC%9D%B4%ED%84%B0_20250324.csv";

export const PET_CULTURE_APPLY_URL = "https://www.data.go.kr/data/15111389/fileData.do";

function parseCsvLine(line: string): string[] {
  const out: string[] = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"') {
        if (line[i + 1] === '"') {
          cur += '"';
          i += 1;
        } else {
          inQuotes = false;
        }
      } else {
        cur += ch;
      }
      continue;
    }
    if (ch === '"') {
      inQuotes = true;
      continue;
    }
    if (ch === ",") {
      out.push(cur);
      cur = "";
      continue;
    }
    cur += ch;
  }
  out.push(cur);
  return out;
}

function clean(value?: string) {
  const v = (value ?? "").trim();
  if (!v || v === "정보없음" || v === "해당없음" || v === "없음" || /^nan$/i.test(v)) return "";
  return v;
}

function mapCultureCategory(cat2: string, cat3: string, name: string): PetBusinessCategory {
  const blob = `${cat2} ${cat3} ${name}`;
  if (/동물약국|약국/.test(blob)) return "동물약국";
  if (/동물병원|응급|수의|메디컬|진료/.test(blob)) return "동물병원";
  if (/미용|그루밍|스파/.test(blob)) return "미용";
  if (/카페|커피|베이커리|티룸/.test(blob)) return "카페";
  if (/펜션|호텔|위탁|유치원|도그호텔|애견호텔/.test(blob)) return "호텔·펜션";
  if (/펫샵|용품|사료|간식/.test(blob)) return "펫샵";
  if (/훈련|행동교정|퍼피클래스/.test(blob)) return "훈련소";
  if (/시터|산책대행|방문돌봄/.test(blob)) return "시터";
  if (/장묘|화장|봉안|납골/.test(blob)) return "장묘";
  if (/보호소|보호센터|유기/.test(blob)) return "보호센터";
  return "동반시설";
}

function looksEmergency(name: string) {
  return /응급|24시|24시간|야간/.test(name);
}

export function fingerprintBusiness(name: string, address?: string) {
  return `${name}|${address ?? ""}`.replace(/\s+/g, "").toLowerCase();
}

export async function ensurePetCultureCsv(): Promise<{ path: string; source: string; bytes: number }> {
  try {
    const st = await fs.stat(LOCAL_CSV);
    if (st.size > 1_000_000) {
      return { path: LOCAL_CSV, source: "local-cache", bytes: st.size };
    }
  } catch {
    /* download */
  }

  await fs.mkdir(path.dirname(LOCAL_CSV), { recursive: true });
  const res = await fetch(DEFAULT_CSV_URL, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`문화시설 CSV 다운로드 실패 HTTP ${res.status}`);
  }
  const buf = Buffer.from(await res.arrayBuffer());
  await fs.writeFile(LOCAL_CSV, buf);
  return { path: LOCAL_CSV, source: "download", bytes: buf.length };
}

export async function loadPetCultureFacilities(): Promise<{
  totalRows: number;
  companionRows: number;
  businesses: PetBusiness[];
}> {
  const { path: csvPath } = await ensurePetCultureCsv();
  const raw = await fs.readFile(csvPath, "utf8");
  const text = raw.charCodeAt(0) === 0xfeff ? raw.slice(1) : raw;
  const lines = text.split(/\r?\n/).filter((l) => l.trim());
  if (lines.length < 2) {
    return { totalRows: 0, companionRows: 0, businesses: [] };
  }

  const headers = parseCsvLine(lines[0]).map((h) => h.trim());
  const idx = (name: string) => headers.indexOf(name);
  const iName = idx("시설명");
  const iCat2 = idx("카테고리2");
  const iCat3 = idx("카테고리3");
  const iSido = idx("시도 명칭");
  const iSigungu = idx("시군구 명칭");
  const iRoad = idx("도로명주소");
  const iLot = idx("지번주소");
  const iPhone = idx("전화번호");
  const iHours = idx("운영시간");
  const iParking = idx("주차 가능여부");
  const iPet = idx("반려동물 동반 가능정보");
  const iUpdated = idx("최종작성일");

  if (iName < 0 || iPet < 0) {
    throw new Error("문화시설 CSV 헤더를 인식하지 못했습니다.");
  }

  const businesses: PetBusiness[] = [];
  let companionRows = 0;

  for (let n = 1; n < lines.length; n += 1) {
    const cols = parseCsvLine(lines[n]);
    const petOk = clean(cols[iPet]).toUpperCase();
    if (petOk !== "Y" && petOk !== "가능" && !petOk.includes("가능")) continue;
    companionRows += 1;

    const name = clean(cols[iName]);
    if (!name) continue;

    const address = clean(cols[iRoad]) || clean(cols[iLot]);
    const sido = clean(cols[iSido]);
    const sigungu = clean(cols[iSigungu]);
    const region = [sido, sigungu].filter(Boolean).join(" ") || (address ? address.split(/\s+/).slice(0, 2).join(" ") : "지역 미상");
    const cat2 = clean(cols[iCat2]);
    const cat3 = clean(cols[iCat3]);
    let category = mapCultureCategory(cat2, cat3, name);
    const emergency = category === "동물병원" && looksEmergency(name);
    if (emergency) category = "응급병원";

    const phone = clean(cols[iPhone]);
    const hours = clean(cols[iHours]);
    const parkingRaw = clean(cols[iParking]).toUpperCase();
    const parking = parkingRaw === "Y" || parkingRaw.includes("가능");
    const updatedAt = clean(cols[iUpdated]) || undefined;
    const sourceId = `${name}|${address}`.slice(0, 120);

    businesses.push({
      id: `culture-${Buffer.from(sourceId).toString("base64url").slice(0, 28)}`,
      name,
      category,
      region,
      address: address || undefined,
      phone: phone || undefined,
      hours: hours || undefined,
      parking: parking || undefined,
      emergency: emergency || undefined,
      updatedAt,
      status: "동반 가능",
      source: "반려동물 동반 문화시설",
      sourceId,
    });
  }

  return {
    totalRows: Math.max(0, lines.length - 1),
    companionRows,
    businesses,
  };
}

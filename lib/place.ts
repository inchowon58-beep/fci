import type { PetBusiness } from "./public-data";
import { sidoOf, sigunguOf } from "./directory";

export function infoDate(business: PetBusiness) {
  const raw = business.updatedAt || business.licensedAt || "";
  const match = raw.match(/\d{4}-\d{2}-\d{2}/);
  return match?.[0] ?? "";
}

function hashPick(seed: string, options: string[]) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return options[h % options.length];
}

function categoryHint(category: string) {
  switch (category) {
    case "동물병원":
    case "응급병원":
      return "반려견 진료·예방접종·응급 여부를 먼저 확인하세요.";
    case "동물약국":
      return "처방전·동물용의약품 취급 여부를 방문 전 확인해 주세요.";
    case "미용":
      return "견종·털 상태에 맞는 미용 일정은 미리 예약하는 편이 좋습니다.";
    case "호텔·펜션":
      return "위탁 전 접종·중성화·성격 고지를 준비해 주세요.";
    case "펫샵":
    case "용품":
      return "사료·용품·분양 관련 안내는 매장에 직접 문의해 주세요.";
    case "보호센터":
      return "입양·임시보호 안내는 센터 운영 시간에 맞춰 연락해 주세요.";
    case "등록대행":
      return "동물등록·마이크로칩 대행이 가능한지 전화로 확인해 보세요.";
    case "운송":
      return "이동 거리·케이지·동반 여부를 미리 협의하세요.";
    case "장묘":
      return "예약·장례 절차는 업체에 직접 문의해 주세요.";
    case "전시":
      return "입장·동반 가능 여부는 현장 안내를 따릅니다.";
    case "카페":
      return "반려견 동반 좌석·메뉴·주차는 방문 전 확인하면 편합니다.";
    case "훈련소":
      return "퍼피·행동교정 과정과 상담 가능 시간을 미리 물어보세요.";
    case "시터":
      return "방문돌봄·산책 범위와 당일 리포트 여부를 확인해 주세요.";
    case "동반시설":
      return "반려동물 동반 가능 구역·입장 규칙을 현장 안내에서 확인하세요.";
    default:
      return "방문 전 영업상태와 연락처를 한 번 더 확인해 주세요.";
  }
}

export function placeCopy(business: PetBusiness) {
  const city = sigunguOf(business);
  const sido = sidoOf(business);
  const date = infoDate(business);
  const address = business.address || business.region;
  const seed = `${business.id}|${business.name}|${city}`;

  const opener = hashPick(seed, [
    `${business.name}은 ${sido} ${city}에서 보호자가 찾을 수 있는 ${business.category}입니다.`,
    `${city} ${business.category}를 찾는다면 ${business.name} 정보를 먼저 확인해 보세요.`,
    `${business.name} — ${city} 반려견·반려동물 보호자를 위한 ${business.category} 안내입니다.`,
    `${sido} ${city} 지역의 ${business.category} ${business.name} 페이지입니다.`,
  ]);

  const mid = hashPick(seed + "m", [
    categoryHint(business.category),
    `${city} 일대 ${business.category} 검색·방문 전에 영업상태와 위치를 맞춰 두면 좋습니다.`,
    `한국애견연맹 반려문화증진위원회 디렉터리에 등록된 ${business.category} 정보입니다.`,
  ]);

  const summaryItems = [
    { label: "업종", value: `${city} · ${business.category}` },
    address ? { label: "위치", value: address } : null,
    business.phone ? { label: "전화", value: business.phone } : null,
    business.status ? { label: "상태", value: business.status } : null,
    business.hours ? { label: "시간", value: business.hours } : null,
    business.emergency ? { label: "응급", value: "응급·야간 표기" } : null,
    {
      label: "기준",
      value: date ? `공공데이터 · 확인일 ${date}` : "공공데이터 인허가 기준",
    },
  ].filter((x): x is { label: string; value: string } => Boolean(x));

  const summary = summaryItems.map((item) => `${item.label}: ${item.value}`).join(" · ");

  const lead = [
    opener,
    mid,
    business.status ? `현재 영업상태는 「${business.status}」로 안내됩니다.` : "",
    business.emergency ? "응급·야간 가능으로 표시된 업체입니다." : "",
    business.phone ? `문의는 ${business.phone}으로 가능합니다.` : "",
    address ? `주소 기준으로는 ${address} 일대입니다.` : "",
  ]
    .filter(Boolean)
    .join(" ");

  const introLead = hashPick(seed + "i", [
    `${business.name} 페이지는 한국애견연맹 반려문화증진위원회 동네 디렉터리에 등록된 정보입니다.`,
    `이 안내는 한국애견연맹 반려문화증진위원회가 모은 ${city} ${business.category} 정보입니다.`,
    `${business.name}은 공공데이터 인허가와 위원회 디렉터리 기준으로 정리된 ${business.category}입니다.`,
  ]);

  const intro = [
    introLead,
    address
      ? `${sido} ${city} ${address} 근처에서 ${business.category}를 찾는 보호자를 위해, 연락·위치·영업상태를 한곳에 모아 두었습니다.`
      : `${sido} ${city}에서 ${business.category}를 찾는 보호자를 위해 공공데이터 기준으로 정리했습니다.`,
    business.source ? `데이터 출처 표기는 「${business.source}」입니다.` : "",
    date ? `정보 확인·갱신 기준일은 ${date}입니다.` : "",
    "사장님이 정보를 갱신하면 더 정확한 안내로 이어집니다. 최신 운영은 업체에 확인해 주세요.",
  ]
    .filter(Boolean)
    .join(" ");

  const faqs = [
    {
      q: `${business.name} 찾아가는 길은 어떻게 되나요?`,
      a: address
        ? `${address} (${sido} ${city}). 지도 앱에서 「${business.name}」 또는 주소로 검색해 주세요.`
        : `${sido} ${city} 일대 (상세 주소는 추후 갱신될 수 있습니다)`,
    },
    business.phone
      ? { q: `${business.name} 전화번호는 무엇인가요?`, a: `${business.phone} — ${city} ${business.category} 문의용 번호입니다.` }
      : null,
    business.status
      ? {
          q: `${business.name} 영업상태는 어떤가요?`,
          a: `공공데이터 기준 「${business.status}」입니다. 당일 휴무·임시 변경은 업체에 확인해 주세요.`,
        }
      : null,
    business.hours
      ? { q: `${business.name} 영업시간은 어떻게 되나요?`, a: business.hours }
      : {
          q: `${city} ${business.category} 방문 전에 무엇을 확인하면 되나요?`,
          a: "영업상태·전화·주소를 확인하고, 응급·예약이 필요하면 방문 전 연락하는 편이 안전합니다.",
        },
    {
      q: `${city}에서 ${business.category}를 고를 때 이 페이지는 무엇을 알려주나요?`,
      a: `${business.name}의 위치·연락·업종·영업상태 등 공공데이터 기반 기본 정보를 한눈에 보여 줍니다.`,
    },
    {
      q: "이 정보는 어디서 왔나요?",
      a: "공공데이터포털 인허가 정보와 한국애견연맹 반려문화증진위원회 디렉터리를 기준으로 안내합니다. 최신 운영 내용은 업체에 확인해 주세요.",
    },
  ].filter((x): x is { q: string; a: string } => Boolean(x?.a));

  return { city, sido, date, address, summary, summaryItems, lead, intro, faqs };
}

export function mapLinks(query: string) {
  const q = encodeURIComponent(query);
  return {
    kakao: `https://map.kakao.com/?q=${q}`,
    naver: `https://map.naver.com/p/search/${q}`,
    googleEmbed: `https://maps.google.com/maps?q=${q}&hl=ko&z=16&output=embed`,
  };
}

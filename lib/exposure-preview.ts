/** 정회원 지원 노출 미리보기 — 웹마스터도구 실측(전달 이미지 · 최근 60일) */

export const exposureSample = {
  keyword: "의정부애견미용학원",
  siteName: "의정부펫스쿨",
  label: "실제 노출 중인 사이트 실예",
  partnerName: "인포씨에스",
} as const;

/** 전달 이미지: 81만 노출 · 1만 클릭 · CTR 1.3% */
export const featuredExposure = {
  period: "최근 60일",
  device: "PC + Mobile",
  updated: "2026.09.03",
  headline: "81만 노출 · 1만 클릭",
  clicks: {
    label: "클릭",
    display: "1만",
    value: 10_000,
    delta: "↑ 15202.9%",
  },
  impressions: {
    label: "노출",
    display: "81만",
    value: 810_000,
    delta: "↑ 18954.5%",
  },
  ctr: {
    label: "평균 CTR",
    display: "1.3%",
    value: 1.3,
    delta: "↘ -0.3%",
  },
  yMax: 40_000,
  labels: ["07.06", "07.16", "07.26", "08.05", "08.15", "08.25"],
  impressionsSeries: [
    2800, 3800, 4100, 4300, 4500, 4200, 7800, 8200, 8000, 8800, 11_200, 12_400, 14_800, 14_200,
    17_400, 17_200, 16_800, 17_600, 21_800, 22_600, 19_800, 23_800, 23_200, 22_800, 22_200, 15_400,
    17_800, 35_800,
  ],
  clicksSeries: [
    40, 50, 55, 58, 60, 62, 90, 95, 92, 110, 140, 155, 180, 175, 210, 205, 200, 220, 260, 270, 240,
    290, 280, 275, 268, 200, 230, 460,
  ],
  screenshot: "/member-support/exposure-810k.jpg",
} as const;

/** Vercel 비용 절감용 캐시·재생성 주기 (초) */
export const REVALIDATE_HOME = 3600; // 1시간
export const REVALIDATE_DIRECTORY = 3600;
export const REVALIDATE_PLACE = 86400; // 24시간 — 상세는 CDN에 오래 둠
export const REVALIDATE_SITEMAP = 86400;
export const REVALIDATE_NAVER = 86400;

/** place 사이트맵 분할 (Google 5만 URL 한도) — robots는 registry 미로드 */
export const PLACE_SITEMAP_CHUNK = 40_000;
/** ~69k 업체 기준 2개. 데이터 늘면 올리고 재배포 */
export const PLACE_SITEMAP_FILE_COUNT = 2;

export function isVercelRuntime() {
  return Boolean(process.env.VERCEL);
}

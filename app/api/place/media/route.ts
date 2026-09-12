import { NextResponse } from "next/server";
import { fetchPlaceNaverMedia, getNaverCredentials } from "@/lib/naver-search";

/** CDN 캐시 가능 — 동일 업체 반복 호출 비용↓ */
export const revalidate = 86400;
export const runtime = "nodejs";

const NAVER_CACHE_SEC = 86400;

export async function GET(req: Request) {
  if (!getNaverCredentials().ok) {
    return NextResponse.json({ ok: false, message: "NAVER API 키 없음" }, { status: 400 });
  }

  const { searchParams } = new URL(req.url);
  const name = String(searchParams.get("name") || "").trim();
  const city = String(searchParams.get("city") || "").trim();
  if (!name) {
    return NextResponse.json({ ok: false, message: "name 필요" }, { status: 400 });
  }

  const media = await fetchPlaceNaverMedia(name, city, { withThumbnails: false });
  return NextResponse.json(
    { ok: true, media },
    {
      headers: {
        "Cache-Control": `public, s-maxage=${NAVER_CACHE_SEC}, stale-while-revalidate=${NAVER_CACHE_SEC}`,
      },
    },
  );
}

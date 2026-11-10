import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/** fci.infocs.co.kr 운영 종료 — 전 경로 유아독존으로 영구 이동 */
const REDIRECT_TARGET = "https://www.yourdogzone.co.kr/";

export function middleware(_request: NextRequest) {
  return NextResponse.redirect(REDIRECT_TARGET, 308);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

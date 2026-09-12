import { NextResponse } from "next/server";
import { ADMIN_COOKIE, adminPasswordConfigured, makeAdminToken, verifyAdminPassword } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: Request) {
  if (!adminPasswordConfigured()) {
    return NextResponse.json(
      { ok: false, message: ".env.local 에 ADMIN_PASSWORD 를 설정해 주세요." },
      { status: 500 },
    );
  }

  const body = (await req.json().catch(() => ({}))) as { password?: string };
  if (!verifyAdminPassword(String(body.password || ""))) {
    return NextResponse.json({ ok: false, message: "비밀번호가 올바르지 않습니다." }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, makeAdminToken(), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}

import { NextResponse } from "next/server";
import { isAdminAuthed } from "@/lib/admin-auth";
import { readCms, writeCms, type CmsFile } from "@/lib/cms";
import { isVercelRuntime } from "@/lib/cache-config";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const cms = await readCms();
  const authed = await isAdminAuthed();
  return NextResponse.json({ ok: true, authed, cms, vercelReadOnly: isVercelRuntime() });
}

export async function PUT(req: Request) {
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ ok: false, message: "로그인이 필요합니다." }, { status: 401 });
  }

  if (isVercelRuntime()) {
    return NextResponse.json(
      {
        ok: false,
        message:
          "Vercel 서버리스는 파일 저장이 유지되지 않습니다. CMS 수정은 로컬에서 data/cms.json 을 편집한 뒤 배포하세요.",
      },
      { status: 403 },
    );
  }

  const body = (await req.json().catch(() => null)) as Omit<CmsFile, "updatedAt"> | null;
  if (!body?.partners || !body?.notices || !body?.kkf) {
    return NextResponse.json({ ok: false, message: "잘못된 요청입니다." }, { status: 400 });
  }

  const cms = await writeCms({
    partners: body.partners,
    notices: body.notices,
    kkf: body.kkf,
  });
  return NextResponse.json({ ok: true, cms });
}

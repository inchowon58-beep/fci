import { NextResponse } from "next/server";
import { DATASETS, getApiKey, importFromPortal, maskApiKey } from "@/lib/public-data";
import { readRegistry, writeRegistry } from "@/lib/registry";
import { fingerprintBusiness } from "@/lib/pet-culture";
import { isVercelRuntime } from "@/lib/cache-config";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
/** Hobby 한도·비용 대비 — 장시간 임포트는 로컬/CI에서 */
export const maxDuration = 60;

export async function POST(req: Request) {
  if (isVercelRuntime()) {
    return NextResponse.json(
      {
        ok: false,
        message:
          "Vercel에서는 공공데이터 전건 수집을 막았습니다(비용·시간·파일 미보존). 로컬에서 npm run dev 후 /import 로 수집하고 data/registered.json 을 커밋·배포하세요.",
      },
      { status: 403 },
    );
  }

  const key = getApiKey();
  if (!key) {
    return NextResponse.json(
      { ok: false, message: ".env.local 에 PUBLIC_DATA_API_KEY 가 없습니다." },
      { status: 400 },
    );
  }

  let datasetIds: string[] | undefined;
  try {
    const body = (await req.json()) as { datasetIds?: string[] };
    if (Array.isArray(body?.datasetIds) && body.datasetIds.length > 0) {
      datasetIds = body.datasetIds.map(String);
    }
  } catch {
    // body 없음 = 전건 수집
  }

  const result = await importFromPortal(datasetIds ? { datasetIds } : undefined);

  if (result.partial) {
    const existing = await readRegistry();
    const replacePrefixes = datasetIds!.map((id) => `${id}-`);
    const keptBusinesses = existing.businesses.filter(
      (b) => !replacePrefixes.some((p) => b.id.startsWith(p)),
    );
    const seen = new Set(keptBusinesses.map((b) => b.id));
    const seenFinger = new Set(
      keptBusinesses.map((b) => fingerprintBusiness(b.name, b.address)),
    );
    const mergedBusinesses = [...keptBusinesses];
    for (const b of result.businesses) {
      const finger = fingerprintBusiness(b.name, b.address);
      if (seen.has(b.id) || seenFinger.has(finger)) continue;
      seen.add(b.id);
      seenFinger.add(finger);
      mergedBusinesses.push(b);
    }

    const probeById = new Map((existing.probes || []).map((p) => [p.id, p]));
    for (const p of result.probes) probeById.set(p.id, p);

    const keepNotices = !datasetIds!.includes("abandon");
    const notices = keepNotices ? existing.notices : result.notices;

    const registry = await writeRegistry({
      businesses: mergedBusinesses,
      notices,
      steps: [...(existing.steps || []).slice(-200), ...result.steps],
      probes: DATASETS.map((d) => probeById.get(d.id)).filter(Boolean) as typeof result.probes,
    });

    return NextResponse.json({
      ok: true,
      keyMasked: maskApiKey(key),
      updatedAt: registry.updatedAt,
      partial: true,
      steps: result.steps,
      probes: result.probes,
      businesses: result.businesses,
      notices: result.notices,
      counts: {
        businesses: registry.businesses.length,
        notices: registry.notices.length,
        added: result.businesses.length,
      },
    });
  }

  const registry = await writeRegistry({
    businesses: result.businesses,
    notices: result.notices,
    steps: result.steps,
    probes: result.probes,
  });

  return NextResponse.json({
    ok: true,
    keyMasked: maskApiKey(key),
    updatedAt: registry.updatedAt,
    partial: false,
    steps: result.steps,
    probes: result.probes,
    businesses: result.businesses,
    notices: result.notices,
    counts: {
      businesses: result.businesses.length,
      notices: result.notices.length,
    },
  });
}

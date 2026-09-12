import { NextResponse } from "next/server";
import { getApiKey, maskApiKey } from "@/lib/public-data";
import { readRegistry } from "@/lib/registry";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const key = getApiKey();
  const registry = await readRegistry();
  return NextResponse.json({
    keyRegistered: Boolean(key),
    keyMasked: key ? maskApiKey(key) : "",
    updatedAt: registry.updatedAt,
    businesses: registry.businesses,
    notices: registry.notices,
    steps: registry.steps,
    probes: registry.probes,
    counts: {
      businesses: registry.businesses.length,
      notices: registry.notices.length,
    },
  });
}

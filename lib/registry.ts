import { promises as fs } from "fs";
import path from "path";
import type { AbandonedNotice, DatasetProbe, ImportStep, PetBusiness } from "./public-data";

export interface RegistryFile {
  updatedAt: string;
  source: string;
  businesses: PetBusiness[];
  notices: AbandonedNotice[];
  steps: ImportStep[];
  probes: DatasetProbe[];
}

const FILE = path.join(process.cwd(), "data", "registered.json");

const EMPTY: RegistryFile = {
  updatedAt: "",
  source: "data.go.kr",
  businesses: [],
  notices: [],
  steps: [],
  probes: [],
};

type CacheState = {
  mtimeMs: number;
  registry: RegistryFile;
  byId: Map<string, PetBusiness>;
};

let cache: CacheState | null = null;
let loading: Promise<CacheState> | null = null;

async function loadCache(): Promise<CacheState> {
  try {
    const stat = await fs.stat(FILE);
    if (cache && cache.mtimeMs === stat.mtimeMs) return cache;

    const raw = await fs.readFile(FILE, "utf8");
    const registry = { ...EMPTY, ...JSON.parse(raw) } as RegistryFile;
    const byId = new Map<string, PetBusiness>();
    for (const b of registry.businesses) byId.set(b.id, b);

    cache = { mtimeMs: stat.mtimeMs, registry, byId };
    return cache;
  } catch {
    const empty: CacheState = {
      mtimeMs: 0,
      registry: { ...EMPTY },
      byId: new Map(),
    };
    cache = empty;
    return empty;
  }
}

async function getCache(): Promise<CacheState> {
  if (cache) {
    try {
      const stat = await fs.stat(FILE);
      if (stat.mtimeMs === cache.mtimeMs) return cache;
    } catch {
      return cache;
    }
  }
  if (!loading) {
    loading = loadCache().finally(() => {
      loading = null;
    });
  }
  return loading;
}

/** 저장 후 메모리 캐시 비우기 */
export function invalidateRegistryCache() {
  cache = null;
}

export async function readRegistry(): Promise<RegistryFile> {
  const hit = await getCache();
  return hit.registry;
}

export async function writeRegistry(next: Omit<RegistryFile, "updatedAt" | "source">): Promise<RegistryFile> {
  if (process.env.VERCEL) {
    throw new Error(
      "Vercel에서는 registered.json 쓰기가 유지되지 않습니다. 로컬에서 임포트 후 커밋·배포하세요.",
    );
  }
  const payload: RegistryFile = {
    updatedAt: new Date().toISOString(),
    source: "data.go.kr",
    ...next,
  };
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(payload), "utf8");
  invalidateRegistryCache();
  return payload;
}

export async function getRegisteredBusinesses(): Promise<PetBusiness[]> {
  const hit = await getCache();
  return hit.registry.businesses;
}

export async function getBusinessById(id: string): Promise<PetBusiness | undefined> {
  const hit = await getCache();
  return hit.byId.get(id);
}

/**
 * 네이버 검색 API (블로그 · 이미지)
 * - 개발자센터: https://openapi.naver.com/v1/search/...
 * - 2026~ 이관: NAVER API HUB (Search API) — 블로그/이미지는 계속 제공
 *   https://developers.naver.com/notice/article/32530
 */

export type NaverBlogItem = {
  title: string;
  link: string;
  description: string;
  bloggername: string;
  bloggerlink: string;
  postdate: string;
  /** 글 OG 이미지 등 — 없으면 UI에서 플레이스홀더 */
  thumbnail?: string;
};

export type NaverImageItem = {
  title: string;
  link: string;
  thumbnail: string;
  sizeheight?: string;
  sizewidth?: string;
};

export type NaverPlaceMedia = {
  query: string;
  fetchedAt: string;
  totalBlog: number;
  blogs: NaverBlogItem[];
  images: NaverImageItem[];
  sourceNote: string;
};

function stripHtml(html: string) {
  return html
    .replace(/<[^>]+>/g, "")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .trim();
}

function formatPostDate(raw: string) {
  if (!/^\d{8}$/.test(raw)) return raw;
  return `${raw.slice(0, 4)}-${raw.slice(4, 6)}-${raw.slice(6, 8)}`;
}

export function getNaverCredentials() {
  const id = process.env.NAVER_CLIENT_ID?.trim() || "";
  const secret = process.env.NAVER_CLIENT_SECRET?.trim() || "";
  return { id, secret, ok: Boolean(id && secret) };
}

async function naverGet<T>(path: string, query: Record<string, string>): Promise<T | null> {
  const { id, secret, ok } = getNaverCredentials();
  if (!ok) return null;

  const url = new URL(`https://openapi.naver.com${path}`);
  for (const [k, v] of Object.entries(query)) url.searchParams.set(k, v);

  const res = await fetch(url, {
    headers: {
      "X-Naver-Client-Id": id,
      "X-Naver-Client-Secret": secret,
    },
    next: { revalidate: 60 * 60 * 12 },
  });

  if (!res.ok) {
    console.warn("[naver]", path, res.status, await res.text().catch(() => ""));
    return null;
  }
  return (await res.json()) as T;
}

type BlogApi = {
  total?: number;
  items?: Array<{
    title?: string;
    link?: string;
    description?: string;
    bloggername?: string;
    bloggerlink?: string;
    postdate?: string;
  }>;
};

type ImageApi = {
  total?: number;
  items?: Array<{
    title?: string;
    link?: string;
    thumbnail?: string;
    sizeheight?: string;
    sizewidth?: string;
  }>;
};

export function buildPlaceSearchQuery(name: string, city: string) {
  const clean = name.replace(/\s+/g, " ").trim();
  const area = city.replace(/\s+/g, " ").trim();
  return area ? `${clean} ${area}` : clean;
}

/** 게시글 페이지의 og:image 등 — 링크 미리보기용(재호스팅 없음) */
function thumbnailCandidateUrls(url: string): string[] {
  const out: string[] = [];
  try {
    const u = new URL(url);
    if (u.hostname === "blog.naver.com" || u.hostname === "m.blog.naver.com") {
      const parts = u.pathname.split("/").filter(Boolean);
      if (parts.length >= 2) {
        const blogId = parts[0];
        const logNo = parts[1];
        // 모바일이 메타를 상단에 두고, 전체 HTML이 수 MB라 스트리밍 조기 종료에 유리
        out.push(`https://m.blog.naver.com/${blogId}/${logNo}`);
        out.push(
          `https://blog.naver.com/PostView.naver?blogId=${encodeURIComponent(blogId)}&logNo=${encodeURIComponent(logNo)}`,
        );
      }
    }
  } catch {
    /* ignore */
  }
  out.push(url);
  return [...new Set(out)];
}

function extractThumbnailFromHtml(html: string): string | undefined {
  const patterns = [
    /property=["']og:image(?::secure_url)?["'][^>]*content=["']([^"']+)["']/i,
    /content=["']([^"']+)["'][^>]*property=["']og:image(?::secure_url)?["']/i,
    /name=["']twitter:image(?::src)?["'][^>]*content=["']([^"']+)["']/i,
    /"ogImage"\s*:\s*"((?:\\.|[^"\\])*)"/,
    /"representativeImageUrl"\s*:\s*"((?:\\.|[^"\\])*)"/,
    /"thumbnailUrl"\s*:\s*"((?:\\.|[^"\\])*)"/,
    /"ogImageUrl"\s*:\s*"((?:\\.|[^"\\])*)"/,
    /(https?:\/\/blogthumb\.pstatic\.net\/[^"'\\\s>]+)/i,
  ];
  for (const re of patterns) {
    const m = html.match(re);
    if (!m?.[1]) continue;
    let src = m[1]
      .replace(/\\u002F/gi, "/")
      .replace(/\\\//g, "/")
      .replace(/&amp;/g, "&")
      .trim();
    if (src.startsWith("//")) src = `https:${src}`;
    if (!/^https?:\/\//i.test(src)) continue;
    // 네이버 기본 OG 아이콘(실제 글 사진 아님)은 제외
    if (/ssl\.pstatic\.net\/static\/blog\/icon\//i.test(src)) continue;
    if (/\/og_default/i.test(src)) continue;
    return src;
  }
  return undefined;
}

async function readResponseHead(res: Response, maxBytes: number): Promise<string> {
  if (!res.body) return (await res.text()).slice(0, maxBytes);

  const reader = res.body.getReader();
  const decoder = new TextDecoder("utf-8");
  let html = "";
  try {
    while (html.length < maxBytes) {
      const { done, value } = await reader.read();
      if (done) break;
      html += decoder.decode(value, { stream: true });
      if (extractThumbnailFromHtml(html)) break;
    }
  } finally {
    try {
      await reader.cancel();
    } catch {
      /* ignore */
    }
  }
  return html.slice(0, maxBytes);
}

async function fetchPostThumbnailOnce(url: string, timeoutMs: number): Promise<string | undefined> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      redirect: "follow",
      headers: {
        Accept: "text/html,application/xhtml+xml",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
      },
      cache: "no-store",
    });
    if (!res.ok) return undefined;
    const html = await readResponseHead(res, 64_000);
    return extractThumbnailFromHtml(html);
  } catch {
    return undefined;
  } finally {
    clearTimeout(timer);
  }
}

async function fetchPostThumbnail(url: string, timeoutMs = 2500): Promise<string | undefined> {
  for (const candidate of thumbnailCandidateUrls(url)) {
    const found = await fetchPostThumbnailOnce(candidate, timeoutMs);
    if (found) return found;
  }
  return undefined;
}

export async function attachBlogThumbnails(
  blogs: NaverBlogItem[],
  limit = 8,
): Promise<NaverBlogItem[]> {
  const head = blogs.slice(0, limit);
  const rest = blogs.slice(limit);
  const enrichedHead = await Promise.all(
    head.map(async (blog) => {
      if (blog.thumbnail) return blog;
      const thumbnail = await fetchPostThumbnail(blog.link);
      return thumbnail ? { ...blog, thumbnail } : blog;
    }),
  );
  return [...enrichedHead, ...rest];
}

type MediaCache = { at: number; data: NaverPlaceMedia };
const mediaCache = new Map<string, MediaCache>();
const MEDIA_TTL_MS = 1000 * 60 * 60 * 24; // 인스턴스 메모리 — CDN s-maxage와 맞춤

export async function fetchPlaceNaverMedia(
  name: string,
  city: string,
  opts?: { withThumbnails?: boolean },
): Promise<NaverPlaceMedia | null> {
  const { ok } = getNaverCredentials();
  if (!ok) return null;

  const query = buildPlaceSearchQuery(name, city);
  // SSR 기본은 OG 스크래핑 없이 — 블로그·이미지는 API만으로 표시
  const withThumbnails = opts?.withThumbnails === true;
  const cacheKey = `${query}|thumb=${withThumbnails ? 1 : 0}`;
  const cached = mediaCache.get(cacheKey);
  if (cached && Date.now() - cached.at < MEDIA_TTL_MS) return cached.data;

  const [blog, image] = await Promise.all([
    naverGet<BlogApi>("/v1/search/blog.json", {
      query,
      display: "8",
      start: "1",
      sort: "sim",
    }),
    naverGet<ImageApi>("/v1/search/image", {
      query,
      display: "8",
      start: "1",
      sort: "sim",
      filter: "large",
    }),
  ]);

  const blogsRaw: NaverBlogItem[] = (blog?.items || [])
    .map((item) => ({
      title: stripHtml(String(item.title || "")),
      link: String(item.link || ""),
      description: stripHtml(String(item.description || "")),
      bloggername: String(item.bloggername || ""),
      bloggerlink: String(item.bloggerlink || "").startsWith("http")
        ? String(item.bloggerlink)
        : `https://${String(item.bloggerlink || "").replace(/^\/\//, "")}`,
      postdate: formatPostDate(String(item.postdate || "")),
    }))
    .filter((b) => b.title && b.link);

  const images: NaverImageItem[] = (image?.items || [])
    .map((item) => ({
      title: stripHtml(String(item.title || "")),
      link: String(item.link || ""),
      thumbnail: String(item.thumbnail || ""),
      sizeheight: item.sizeheight,
      sizewidth: item.sizewidth,
    }))
    .filter((img) => img.thumbnail && img.link);

  const blogs = withThumbnails ? await attachBlogThumbnails(blogsRaw, 8) : blogsRaw;

  const data: NaverPlaceMedia = {
    query,
    fetchedAt: new Date().toISOString(),
    totalBlog: Number(blog?.total || blogs.length),
    blogs,
    images,
    sourceNote:
      "📷 사진·후기 출처: 네이버 검색(블로그·이미지) · 저작권은 원 게시자에게 있습니다 · 삭제 요청은 하단 안내를 이용해 주세요.",
  };
  mediaCache.set(cacheKey, { at: Date.now(), data });
  return data;
}

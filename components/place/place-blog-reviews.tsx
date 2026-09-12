import type { NaverBlogItem } from "@/lib/naver-search";

function blogHostHint(link: string) {
  try {
    const host = new URL(link).hostname.replace(/^m\./, "");
    if (host.includes("blog.naver.com")) return "blog.naver.com";
    if (host.includes("tistory.com")) return "tistory.com";
    return host;
  } catch {
    return "네이버 블로그";
  }
}

export function PlaceBlogReviews({
  blogs,
  total,
  businessName,
}: {
  blogs: NaverBlogItem[];
  total: number;
  businessName: string;
}) {
  if (blogs.length === 0) return null;

  return (
    <section className="nb-feed" id="bxa_blog" aria-label="네이버 블로그 리뷰">
      <header className="nb-feed-head">
        <div className="nb-feed-brand">
          <span className="nb-feed-mark" aria-hidden>
            N
          </span>
          <div>
            <p className="nb-feed-eyebrow">Naver Blog</p>
            <h2>네이버 블로그 리뷰</h2>
          </div>
        </div>
        <p className="nb-feed-count">
          «{businessName}» 관련 <strong>{total.toLocaleString()}건</strong> 중 {blogs.length}건
        </p>
      </header>

      <ul className="nb-feed-list">
        {blogs.map((blog, index) => (
          <li key={blog.link} className="nb-post">
            <a className="nb-post-link" href={blog.link} target="_blank" rel="noopener noreferrer">
              <span className="nb-post-num" aria-hidden>
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="nb-post-body">
                <p className="nb-post-meta">
                  <span className="nb-blogger">{blog.bloggername || "블로거"}</span>
                  <span className="nb-host">
                    {blogHostHint(blog.link)}
                    {blog.postdate ? ` · ${blog.postdate}` : ""}
                  </span>
                </p>
                <h3 className="nb-post-title">{blog.title}</h3>
                {blog.description ? <p className="nb-post-excerpt">{blog.description}</p> : null}
              </div>
            </a>
          </li>
        ))}
      </ul>

      <footer className="nb-feed-foot">
        이 목록은 네이버 블로그 검색 결과입니다.{" "}
        <a href="/#owner">삭제·정정 요청</a>
      </footer>
    </section>
  );
}

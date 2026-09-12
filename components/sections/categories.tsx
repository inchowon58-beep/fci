import { categories } from "@/lib/copy";
import { DIRECTORY_CATEGORIES, categoryPath, filterByCategory } from "@/lib/directory";
import { getRegisteredBusinesses } from "@/lib/registry";

export async function Categories() {
  const businesses = await getRegisteredBusinesses();

  return (
    <section id="categories" className="section-bx border-t border-[var(--border)] bg-[var(--bg-elevated)]">
      <div className="container-bx">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{categories.title}</h2>
        <p className="mt-4 max-w-3xl text-[var(--fg-soft)]">{categories.body}</p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {DIRECTORY_CATEGORIES.map((c) => {
            const count = filterByCategory(businesses, c).length;
            return (
              <a
                key={c.slug}
                href={categoryPath(c.slug)}
                className="glow-card block p-5 transition-transform hover:-translate-y-0.5"
              >
                <div className="text-2xl">{c.icon}</div>
                <h3 className="mt-3 font-bold">{c.title}</h3>
                <p className="mt-2 text-sm text-[var(--fg-muted)]">{c.blurb}</p>
                <p className="mt-4 text-sm text-[var(--accent)]">
                  {count > 0 ? `${count}곳 · 지역별로 보기` : "아직 등록 전"}
                </p>
              </a>
            );
          })}
        </div>
        <p className="mt-6 text-sm text-[var(--fg-soft)]">
          카드를 누르면 시·도별로 업체가 나옵니다. 상호를 누르면 그 가게 페이지입니다.
        </p>
      </div>
    </section>
  );
}

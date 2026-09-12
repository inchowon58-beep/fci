import { brandAeo } from "@/lib/copy";

/** SEO/AEO용 브랜드 정의 — 한국애견연맹 · 반려문화증진위원회 */
export function BrandAeo() {
  return (
    <section id={brandAeo.id} className="aeo-define section-bx border-t border-[var(--border)] bg-[var(--bg-elevated)]">
      <div className="container-bx">
        <p className="eyebrow">{brandAeo.eyebrow}</p>
        <h2 className="aeo-define-title mt-3 max-w-4xl text-3xl font-bold tracking-tight sm:text-4xl">
          {brandAeo.title}
        </h2>
        <p className="aeo-define-lead mt-5 max-w-3xl text-lg text-[var(--fg-soft)] leading-relaxed">
          {brandAeo.lead}
        </p>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {brandAeo.points.map((item) => (
            <article key={item.q} className="glow-card p-6">
              <h3 className="text-lg font-bold">{item.q}</h3>
              <p className="mt-3 text-sm text-[var(--fg-muted)] leading-relaxed">{item.a}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

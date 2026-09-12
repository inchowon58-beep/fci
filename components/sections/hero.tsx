import { hero } from "@/lib/copy";
import { getRegisteredBusinesses } from "@/lib/registry";

export async function Hero() {
  const registered = await getRegisteredBusinesses();
  const stats = hero.stats.map((s) =>
    s.label === "등록 펫 업체" && registered.length
      ? { ...s, value: `${registered.length}+` }
      : s,
  );
  return (
    <section className="relative overflow-hidden section-bx pt-16 pb-24 border-t border-[var(--border)]">
      <div className="pointer-events-none absolute inset-0 grid-fade opacity-60" />
      <div className="container-bx relative">
        <p className="eyebrow mb-5">{hero.eyebrow}</p>
        <h1 className="hero-brand max-w-4xl">
          <span className="hero-brand-line gradient-text">{hero.brandLine1}</span>
          <span className="hero-brand-line gradient-text">{hero.brandLine2}</span>
        </h1>
        <p className="mt-5 max-w-3xl text-xl font-semibold tracking-tight text-[var(--fg)] sm:text-2xl">
          {hero.title}
        </p>
        <p className="mt-4 max-w-2xl text-lg text-[var(--fg-soft)]">{hero.lead}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href="/c" className="btn-primary">
            {hero.ctaPrimary}
          </a>
          <a href="/#about-kkf" className="btn-ghost">
            {hero.ctaSecondary}
          </a>
        </div>
        <dl className="mt-12 grid gap-4 sm:grid-cols-3">
          {stats.map((s) => (
            <div key={s.label} className="glow-card p-5">
              <dt className="text-3xl font-bold text-[var(--accent)]">{s.value}</dt>
              <dd className="mt-1 text-sm text-[var(--fg-muted)]">{s.label}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

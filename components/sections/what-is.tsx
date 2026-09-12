import { whatIs } from "@/lib/copy";

export function WhatIs() {
  return (
    <section id="what" className="section-bx border-t border-[var(--border)]">
      <div className="container-bx">
        <p className="eyebrow">{whatIs.eyebrow}</p>
        <h2 className="mt-3 max-w-4xl text-3xl font-bold tracking-tight sm:text-4xl">{whatIs.title}</h2>
        <p className="mt-5 max-w-3xl text-[var(--fg-soft)]">{whatIs.body}</p>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {whatIs.pillars.map((p) => (
            <article key={p.title} className="glow-card p-6">
              <h3 className="text-lg font-bold">{p.title}</h3>
              <p className="mt-3 text-sm text-[var(--fg-muted)] leading-relaxed">{p.body}</p>
            </article>
          ))}
        </div>
        <div className="mt-10 glow-card p-6">
          <h3 className="font-bold">한 페이지에 담기는 것</h3>
          <ul className="mt-4 grid gap-2 text-sm text-[var(--fg-soft)] sm:grid-cols-2">
            {whatIs.includes.map((line) => (
              <li key={line} className="flex gap-2">
                <span className="text-[var(--accent)]">:</span>
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

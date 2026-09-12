import { faq } from "@/lib/copy";

export function Faq() {
  return (
    <section id="faq" className="section-bx border-t border-[var(--border)] bg-[var(--bg-elevated)]">
      <div className="container-bx">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{faq.title}</h2>
        <p className="mt-4 max-w-3xl text-[var(--fg-soft)]">{faq.summary}</p>
        <div className="mt-10 space-y-3">
          {faq.items.map((item, idx) => (
            <details key={item.q} className="glow-card group p-5 open:border-[var(--border-strong)]">
              <summary className="cursor-pointer list-none font-semibold flex items-start gap-3">
                <span className="text-[var(--accent)] text-sm mt-0.5">Q{String(idx + 1).padStart(2, "0")}</span>
                <span>{item.q}</span>
              </summary>
              <p className="mt-3 pl-10 text-sm text-[var(--fg-muted)] leading-relaxed">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

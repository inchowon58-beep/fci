import { partners } from "@/lib/copy";

export function Partners() {
  return (
    <section className="section-bx border-t border-[var(--border)]">
      <div className="container-bx">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{partners.title}</h2>
        <p className="mt-4 max-w-3xl text-[var(--fg-soft)]">{partners.body}</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {["한국애견연맹", "지역 현장", "보호자·이웃"].map((label) => (
            <div
              key={label}
              className="glow-card flex h-28 items-center justify-center text-sm text-[var(--fg-muted)]"
            >
              {label}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

import type { PetBusiness } from "@/lib/public-data";
import { businessPath } from "@/lib/directory";

export function BusinessCard({ business }: { business: PetBusiness }) {
  return (
    <a href={businessPath(business.id)} className="glow-card block p-5 transition-transform hover:-translate-y-0.5">
      <div className="flex items-center justify-between gap-2 text-xs">
        <span className="rounded-full bg-[var(--accent-glow)] px-2 py-1 text-[var(--accent)]">
          {business.category}
        </span>
        <span className="text-[var(--fg-muted)]">{business.region}</span>
      </div>
      <h3 className="mt-3 font-bold">{business.name}</h3>
      {business.address ? <p className="mt-2 text-sm text-[var(--fg-soft)]">{business.address}</p> : null}
      {business.phone ? <p className="mt-2 text-sm text-[var(--fg-soft)]">{business.phone}</p> : null}
      {business.emergency ? (
        <p className="mt-2 text-xs font-semibold text-[var(--pet)]">응급 · 야간 가능</p>
      ) : null}
    </a>
  );
}

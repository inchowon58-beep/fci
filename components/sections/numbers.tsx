import { numbers } from "@/lib/copy";
import { getRegisteredBusinesses } from "@/lib/registry";
import { DIRECTORY_CATEGORIES } from "@/lib/directory";

export async function Numbers() {
  const businesses = await getRegisteredBusinesses();
  const count = businesses.length;
  const items = [
    { value: count ? count.toLocaleString("ko-KR") : "—", label: "등록 펫 업체" },
    { value: count ? count.toLocaleString("ko-KR") : "—", label: "상세 페이지" },
    { value: String(DIRECTORY_CATEGORIES.length), label: "다루는 업종" },
    { value: "무료", label: "누구나 열람" },
  ];

  return (
    <section className="section-bx border-t border-[var(--border)]">
      <div className="container-bx">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{numbers.title}</h2>
        <p className="mt-3 text-sm text-[var(--fg-muted)]">{numbers.note}</p>
        <dl className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((n) => (
            <div key={n.label} className="glow-card p-6 text-center">
              <dt className="text-4xl font-extrabold text-[var(--accent)]">{n.value}</dt>
              <dd className="mt-2 text-sm text-[var(--fg-muted)]">{n.label}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

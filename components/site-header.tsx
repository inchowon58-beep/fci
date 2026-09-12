import { nav } from "@/lib/copy";
import { SiteLogo } from "@/components/site-logo";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[rgba(5,5,10,0.82)] backdrop-blur-xl">
      <div className="container-bx flex h-16 items-center justify-between gap-4">
        <a href="/" className="min-w-0">
          <SiteLogo />
        </a>
        <nav className="hidden items-center gap-5 text-sm text-[var(--fg-soft)] lg:flex">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="hover:text-[var(--accent)] transition-colors"
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <a
            href="/admin"
            className="hidden text-sm text-[var(--fg-soft)] hover:text-[var(--accent)] sm:inline"
          >
            관리
          </a>
          <a
            href="/import"
            className="hidden text-sm text-[var(--fg-soft)] hover:text-[var(--accent)] md:inline"
          >
            공공데이터
          </a>
          <a href="/c" className="btn-primary text-sm px-4 min-h-10">
            업종 찾기
          </a>
        </div>
      </div>
    </header>
  );
}

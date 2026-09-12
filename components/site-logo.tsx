import { site } from "@/lib/copy";

export function SiteLogo({ compact = false }: { compact?: boolean }) {
  return (
    <span className="site-logo">
      <img className="site-logo-mark" src="/kkf/logo.png?v=2" alt={site.officialName} />
      {compact ? null : (
        <span className="site-logo-text">
          <span>한국애견연맹</span>
          <span>반려문화증진위원회</span>
        </span>
      )}
    </span>
  );
}

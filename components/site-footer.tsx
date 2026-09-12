import { footer, site } from "@/lib/copy";
import { readCms } from "@/lib/cms";

export async function SiteFooter() {
  const cms = await readCms();
  const kkf = cms.kkf;
  const fields = [
    `운영: ${kkf.operator || footer.org}`,
    kkf.chairperson ? `위원장: ${kkf.chairperson}` : null,
    kkf.federationAddress ? `한국애견연맹 주소: ${kkf.federationAddress}` : null,
    kkf.committeeAddress ? `반려문화증진위원회 주소: ${kkf.committeeAddress}` : null,
    kkf.federationEmail ? `한국애견연맹 이메일: ${kkf.federationEmail}` : null,
    kkf.committeeEmail ? `반려문화증진위원회 이메일: ${kkf.committeeEmail}` : null,
    kkf.committeePhone ? `반려문화증진위원회 전화: ${kkf.committeePhone}` : null,
  ].filter(Boolean) as string[];

  return (
    <footer className="border-t border-[var(--border)] bg-[var(--bg-elevated)] py-14">
      <div className="container-bx space-y-6">
        <div className="flex flex-wrap items-center gap-3">
          <img className="site-logo-mark site-logo-mark-lg" src="/kkf/logo.png?v=2" alt={site.officialName} />
          <div>
            <div className="text-lg font-bold">{footer.org}</div>
            <a
              href={kkf.siteUrl || site.officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-block text-sm text-[var(--accent)] underline-offset-2 hover:underline"
            >
              {kkf.org || site.officialName} 공식 사이트 →
            </a>
          </div>
        </div>
        <ul className="grid gap-2 text-sm text-[var(--fg-muted)] sm:grid-cols-2">
          {fields.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
        {kkf.blurb ? <p className="text-sm text-[var(--fg-soft)] leading-relaxed">{kkf.blurb}</p> : null}
        <p className="text-xs text-[var(--fg-muted)] leading-relaxed">{footer.note}</p>
        <p className="text-xs text-[var(--fg-muted)]">
          <a
            href={kkf.siteUrl || site.officialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[var(--accent)]"
          >
            {kkf.siteUrl || site.officialUrl}
          </a>
          {kkf.committeeEmail ? (
            <>
              {" · "}
              <a href={`mailto:${kkf.committeeEmail}`} className="hover:text-[var(--accent)]">
                {kkf.committeeEmail}
              </a>
            </>
          ) : null}
          {kkf.committeePhone ? (
            <>
              {" · "}
              <a href={`tel:${kkf.committeePhone.replace(/-/g, "")}`} className="hover:text-[var(--accent)]">
                {kkf.committeePhone}
              </a>
            </>
          ) : null}
        </p>
        <p className="text-xs text-[var(--fg-muted)]">
          © {new Date().getFullYear()} {footer.org}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

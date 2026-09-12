import type { ReactNode } from "react";
import type { PartnerSlot } from "@/lib/cms";

function PartnerCard({ partner }: { partner: PartnerSlot }) {
  return (
    <article className="partner-card">
      {partner.badge ? <span className="partner-badge">{partner.badge}</span> : null}
      <div className="partner-banner">
        {partner.banner ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={partner.banner} alt="" />
        ) : (
          <div className="partner-banner-empty">배너</div>
        )}
      </div>
      <div className="partner-body">
        <h3 className="partner-name">{partner.name}</h3>
        {partner.intro ? <p className="partner-intro">{partner.intro}</p> : null}
        <ul className="partner-meta">
          {partner.phone ? (
            <li>
              <span>연락처</span>
              <a href={`tel:${partner.phone.replace(/[^0-9]/g, "")}`}>{partner.phone}</a>
            </li>
          ) : null}
          {partner.homepage ? (
            <li>
              <span>홈페이지</span>
              <a
                href={partner.homepage}
                target={partner.homepage.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
              >
                바로가기
              </a>
            </li>
          ) : null}
          {partner.kakao ? (
            <li>
              <span>카톡문의</span>
              <a href={partner.kakao} target="_blank" rel="noopener noreferrer">
                문의하기
              </a>
            </li>
          ) : null}
        </ul>
      </div>
    </article>
  );
}

export function PlacePartnerPanel({
  partners,
  notice,
}: {
  partners: (PartnerSlot | null)[];
  notice: ReactNode;
}) {
  const slots = [...partners];
  while (slots.length < 3) slots.push(null);

  return (
    <section className="partner-panel" aria-label="제휴·연맹 안내">
      <div className="partner-cell">{notice}</div>
      {slots.slice(0, 3).map((partner, i) =>
        partner ? (
          <div className="partner-cell" key={`p-${i}-${partner.name}`}>
            <PartnerCard partner={partner} />
          </div>
        ) : (
          <div className="partner-cell" key={`empty-${i}`}>
            <div className="partner-card partner-empty">제휴 자리</div>
          </div>
        ),
      )}
    </section>
  );
}

import type { KkfInfo, NoticeItem } from "@/lib/cms";

export function KkfNoticeBoard({
  notices,
  kkf,
}: {
  notices: NoticeItem[];
  kkf: KkfInfo;
}) {
  return (
    <aside className="kkf-board" aria-label="한국애견연맹 알림판">
      <div className="kkf-board-head">
        <div>
          <p className="kkf-board-eyebrow">Korea Kennel Federation</p>
          <h2>연맹 알림판</h2>
        </div>
        <a className="kkf-board-more" href={kkf.siteUrl} target="_blank" rel="noopener noreferrer">
          공식
        </a>
      </div>
      <ul className="kkf-board-list">
        {notices.length === 0 ? (
          <li className="kkf-board-empty">등록된 알림이 없습니다.</li>
        ) : (
          notices.map((n) => (
            <li key={n.id}>
              <a href={n.href || kkf.siteUrl} target="_blank" rel="noopener noreferrer">
                {n.pinned ? <span className="kkf-pin">고정</span> : null}
                <span className="kkf-board-title">{n.title}</span>
                {n.date ? <span className="kkf-board-date">{n.date}</span> : null}
              </a>
            </li>
          ))
        )}
      </ul>
      <div className="kkf-board-foot">
        <a href={`tel:${kkf.committeePhone.replace(/-/g, "")}`}>{kkf.committeePhone}</a>
        <a href={`mailto:${kkf.committeeEmail}`}>{kkf.committeeEmail}</a>
        <a href={kkf.siteUrl} target="_blank" rel="noopener noreferrer">
          thekkf.or.kr
        </a>
      </div>
    </aside>
  );
}

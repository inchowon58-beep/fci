"use client";

import { useEffect, useState } from "react";
import type { CmsFile, NoticeItem, PartnerSlot } from "@/lib/cms";

type Status = { authed: boolean; cms: CmsFile | null; message: string };

const emptyPartner = (): PartnerSlot => ({
  active: true,
  name: "",
  phone: "",
  homepage: "",
  kakao: "",
  intro: "",
  banner: "",
  badge: "",
});

export function AdminConsole() {
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<Status>({ authed: false, cms: null, message: "" });
  const [busy, setBusy] = useState(false);

  async function refresh() {
    const res = await fetch("/api/admin/cms");
    const json = await res.json();
    setStatus({
      authed: Boolean(json.authed),
      cms: json.cms,
      message: "",
    });
  }

  useEffect(() => {
    void refresh();
  }, []);

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    const json = await res.json();
    setBusy(false);
    if (!json.ok) {
      setStatus((s) => ({ ...s, message: json.message || "로그인 실패" }));
      return;
    }
    setPassword("");
    await refresh();
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    await refresh();
  }

  async function save() {
    if (!status.cms) return;
    setBusy(true);
    const res = await fetch("/api/admin/cms", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        partners: status.cms.partners,
        notices: status.cms.notices,
        kkf: status.cms.kkf,
      }),
    });
    const json = await res.json();
    setBusy(false);
    if (!json.ok) {
      setStatus((s) => ({ ...s, message: json.message || "저장 실패" }));
      return;
    }
    setStatus({ authed: true, cms: json.cms, message: "저장되었습니다." });
  }

  function patchCms(fn: (cms: CmsFile) => CmsFile) {
    setStatus((s) => (s.cms ? { ...s, cms: fn(structuredClone(s.cms)), message: "" } : s));
  }

  if (!status.authed || !status.cms) {
    return (
      <form className="admin-box" onSubmit={login}>
        <h1>관리자 로그인</h1>
        <p className="admin-muted">파트너·알림판을 수정합니다. (.env.local 의 ADMIN_PASSWORD)</p>
        <label>
          비밀번호
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </label>
        {status.message ? <p className="admin-err">{status.message}</p> : null}
        <button type="submit" disabled={busy} className="btn-primary">
          {busy ? "확인 중…" : "로그인"}
        </button>
      </form>
    );
  }

  const cms = status.cms;

  return (
    <div className="admin-wrap">
      <header className="admin-head">
        <div>
          <h1>콘텐츠 관리</h1>
          <p className="admin-muted">2×2 · 왼쪽 위 알림판 · 나머지 3칸 제휴</p>
        </div>
        <div className="admin-actions">
          <button type="button" className="btn-ghost" onClick={() => void logout()}>
            로그아웃
          </button>
          <button type="button" className="btn-primary" disabled={busy} onClick={() => void save()}>
            {busy ? "저장 중…" : "저장"}
          </button>
        </div>
      </header>
      {status.message ? <p className="admin-ok">{status.message}</p> : null}

      <section className="admin-box">
        <h2>제휴 3칸 (알림판 제외)</h2>
        {[0, 1, 2].map((idx) => {
          const list = Array.isArray(cms.partners) ? [...cms.partners] : [];
          while (list.length < 3) list.push(emptyPartner());
          return (
            <PartnerEditor
              key={idx}
              label={`제휴 ${idx + 1}`}
              partner={list[idx] || emptyPartner()}
              onChange={(partner) =>
                patchCms((c) => {
                  const next = Array.isArray(c.partners) ? [...c.partners] : [];
                  while (next.length < 3) next.push(emptyPartner());
                  next[idx] = partner;
                  c.partners = next.slice(0, 3);
                  return c;
                })
              }
            />
          );
        })}
      </section>

      <section className="admin-box">
        <div className="admin-row-head">
          <h2>KKF 알림판 (왼쪽 상단)</h2>
          <button
            type="button"
            className="btn-ghost"
            onClick={() =>
              patchCms((c) => {
                c.notices = [
                  {
                    id: `n${Date.now()}`,
                    title: "새 알림",
                    date: new Date().toISOString().slice(0, 10),
                    href: c.kkf.siteUrl,
                    pinned: false,
                  },
                  ...c.notices,
                ];
                return c;
              })
            }
          >
            + 알림 추가
          </button>
        </div>
        <div className="admin-list">
          {cms.notices.map((notice, idx) => (
            <NoticeEditor
              key={notice.id}
              notice={notice}
              onChange={(next) =>
                patchCms((c) => {
                  c.notices[idx] = next;
                  return c;
                })
              }
              onRemove={() =>
                patchCms((c) => {
                  c.notices = c.notices.filter((_, i) => i !== idx);
                  return c;
                })
              }
            />
          ))}
        </div>
      </section>
    </div>
  );
}

function PartnerEditor({
  label,
  partner,
  onChange,
}: {
  label: string;
  partner: PartnerSlot;
  onChange: (p: PartnerSlot) => void;
}) {
  return (
    <div className="admin-card">
      <div className="admin-row-head">
        <strong>{label}</strong>
        <label className="admin-check">
          <input
            type="checkbox"
            checked={partner.active}
            onChange={(e) => onChange({ ...partner, active: e.target.checked })}
          />
          노출
        </label>
      </div>
      <label>
        업체명
        <input value={partner.name} onChange={(e) => onChange({ ...partner, name: e.target.value })} />
      </label>
      <label>
        배너 이미지 URL
        <input
          value={partner.banner || ""}
          onChange={(e) => onChange({ ...partner, banner: e.target.value })}
          placeholder="/kkf/logo.png"
        />
      </label>
      <label>
        업체 소개글
        <textarea
          rows={3}
          value={partner.intro || ""}
          onChange={(e) => onChange({ ...partner, intro: e.target.value })}
        />
      </label>
      <div className="admin-grid2">
        <label>
          연락처
          <input value={partner.phone || ""} onChange={(e) => onChange({ ...partner, phone: e.target.value })} />
        </label>
        <label>
          배지
          <input value={partner.badge || ""} onChange={(e) => onChange({ ...partner, badge: e.target.value })} />
        </label>
      </div>
      <div className="admin-grid2">
        <label>
          홈페이지
          <input
            value={partner.homepage || ""}
            onChange={(e) => onChange({ ...partner, homepage: e.target.value })}
          />
        </label>
        <label>
          카톡문의 링크
          <input value={partner.kakao || ""} onChange={(e) => onChange({ ...partner, kakao: e.target.value })} />
        </label>
      </div>
    </div>
  );
}

function NoticeEditor({
  notice,
  onChange,
  onRemove,
}: {
  notice: NoticeItem;
  onChange: (n: NoticeItem) => void;
  onRemove: () => void;
}) {
  return (
    <div className="admin-card">
      <div className="admin-row-head">
        <label className="admin-check">
          <input
            type="checkbox"
            checked={Boolean(notice.pinned)}
            onChange={(e) => onChange({ ...notice, pinned: e.target.checked })}
          />
          고정
        </label>
        <button type="button" className="btn-ghost" onClick={onRemove}>
          삭제
        </button>
      </div>
      <label>
        제목
        <input value={notice.title} onChange={(e) => onChange({ ...notice, title: e.target.value })} />
      </label>
      <div className="admin-grid2">
        <label>
          날짜/상태
          <input value={notice.date || ""} onChange={(e) => onChange({ ...notice, date: e.target.value })} />
        </label>
        <label>
          링크
          <input value={notice.href || ""} onChange={(e) => onChange({ ...notice, href: e.target.value })} />
        </label>
      </div>
    </div>
  );
}

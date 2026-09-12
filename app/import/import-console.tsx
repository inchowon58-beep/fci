"use client";

import { useEffect, useMemo, useState } from "react";
import type { AbandonedNotice, DatasetProbe, ImportStep, PetBusiness } from "@/lib/public-data";

type StatusPayload = {
  keyRegistered: boolean;
  keyMasked: string;
  updatedAt?: string;
  businesses: PetBusiness[];
  notices: AbandonedNotice[];
  steps: ImportStep[];
  probes: DatasetProbe[];
  counts: { businesses: number; notices: number };
};

const LEVEL_COLOR = {
  info: "text-[var(--fg-soft)]",
  ok: "text-[var(--accent)]",
  warn: "text-[var(--pet)]",
  error: "text-[#ff6b8a]",
};

const TABLE_PAGE = 50;

export function ImportConsole() {
  const [status, setStatus] = useState<StatusPayload | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [tablePage, setTablePage] = useState(0);

  async function loadStatus() {
    const res = await fetch("/api/public-data/status", { cache: "no-store" });
    const json = (await res.json()) as StatusPayload;
    setStatus(json);
    setTablePage(0);
    return json;
  }

  async function runImport() {
    setBusy(true);
    setError("");
    setTablePage(0);
    try {
      const res = await fetch("/api/public-data/import", { method: "POST" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "등록 실패");
      setStatus({
        keyRegistered: true,
        keyMasked: json.keyMasked,
        updatedAt: json.updatedAt,
        businesses: json.businesses,
        notices: json.notices,
        steps: json.steps,
        probes: json.probes,
        counts: json.counts,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "등록 실패");
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    loadStatus().catch((e) => setError(e instanceof Error ? e.message : "상태 조회 실패"));
  }, []);

  const counts = useMemo(() => {
    const map = new Map<string, number>();
    for (const b of status?.businesses ?? []) {
      map.set(b.category, (map.get(b.category) ?? 0) + 1);
    }
    return [...map.entries()].sort((a, b) => b[1] - a[1]);
  }, [status?.businesses]);

  const businesses = status?.businesses ?? [];
  const pageCount = Math.max(1, Math.ceil(businesses.length / TABLE_PAGE));
  const pageItems = businesses.slice(tablePage * TABLE_PAGE, tablePage * TABLE_PAGE + TABLE_PAGE);
  const notices = (status?.notices ?? []).slice(0, 24);

  return (
    <div className="space-y-8">
      <div className="glow-card p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.14em] text-[var(--accent)]">API KEY</p>
            <p className="mt-2 font-mono text-lg">
              {status?.keyRegistered ? status.keyMasked : "미등록"}
            </p>
            <p className="mt-1 text-sm text-[var(--fg-muted)]">
              {status?.keyRegistered
                ? "영업중 OpenAPI 전건 + 한국문화정보원 동반 문화시설 CSV를 등록합니다. 수만 건이면 1~3분 걸릴 수 있습니다."
                : "PUBLIC_DATA_API_KEY 를 .env.local 에 넣어야 합니다."}
            </p>
          </div>
          <button className="btn-primary" onClick={runImport} disabled={busy || !status?.keyRegistered}>
            {busy ? "전건 가져오는 중…" : "전부 가져와서 등록"}
          </button>
        </div>
        {busy ? (
          <p className="mt-4 text-sm text-[var(--accent)]">
            포털 API를 페이지 단위로 호출 중입니다. 창을 닫지 마세요.
          </p>
        ) : null}
        {error ? <p className="mt-4 text-sm text-[#ff6b8a]">{error}</p> : null}
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {(status?.probes ?? []).map((probe) => (
          <article key={probe.id} className="glow-card p-4">
            <div className="flex items-center justify-between gap-2 text-xs">
              <span className="text-[var(--fg-muted)]">{probe.name}</span>
              <span className={probe.ok ? "text-[var(--accent)]" : "text-[var(--pet)]"}>
                {probe.ok ? "연결됨" : "보류"}
              </span>
            </div>
            <p className="mt-2 text-sm text-[var(--fg-soft)]">{probe.message}</p>
          </article>
        ))}
      </div>

      <section className="glow-card overflow-hidden">
        <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-3">
          <h2 className="text-sm font-semibold">등록 로그</h2>
          <span className="text-xs text-[var(--fg-muted)]">{status?.steps.length ?? 0}줄</span>
        </div>
        <ol className="max-h-[420px] space-y-1 overflow-auto bg-[#07070f] p-4 font-mono text-[13px] leading-6">
          {!status?.steps.length ? (
            <li className="text-[var(--fg-muted)]">
              「전부 가져와서 등록」을 누르면 데이터셋별 페이지 수집 → 전건 등록이 여기에 찍힙니다.
              Vercel 배포 환경에서는 비용·파일 미보존으로 수집이 차단됩니다. 로컬에서 수집 후{" "}
              <code>data/registered.json</code> 을 커밋·배포하세요.
            </li>
          ) : (
            status.steps.map((step, i) => (
              <li key={`${step.at}-${i}`} className={LEVEL_COLOR[step.level]}>
                <span className="text-[var(--fg-muted)]">{step.at.slice(11, 19)}</span>{" "}
                {step.level === "ok" ? "✓" : step.level === "warn" ? "!" : step.level === "error" ? "✗" : "·"}{" "}
                {step.message}
              </li>
            ))
          )}
        </ol>
      </section>

      <section>
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold">
              지금 등록된 업체 {(status?.counts.businesses ?? 0).toLocaleString()}곳
            </h2>
            <p className="mt-1 text-sm text-[var(--fg-muted)]">
              {counts.map(([cat, n]) => `${cat} ${n.toLocaleString()}`).join(" · ") || "아직 없음"}
            </p>
          </div>
          <a href="/#live" className="btn-ghost text-sm min-h-10 px-4">
            홈 LIVE에서 보기
          </a>
        </div>
        <div className="overflow-x-auto rounded-[var(--radius)] border border-[var(--border)]">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-[var(--bg-elevated)] text-[var(--fg-muted)]">
              <tr>
                <th className="px-4 py-3 font-medium">업종</th>
                <th className="px-4 py-3 font-medium">상호</th>
                <th className="px-4 py-3 font-medium">지역</th>
                <th className="px-4 py-3 font-medium">전화</th>
                <th className="px-4 py-3 font-medium">상태</th>
              </tr>
            </thead>
            <tbody>
              {pageItems.map((b) => (
                <tr key={b.id} className="border-t border-[var(--border)]">
                  <td className="px-4 py-3 text-[var(--accent)]">{b.category}</td>
                  <td className="px-4 py-3 font-semibold">
                    <a href={`/place/${encodeURIComponent(b.id)}`} className="hover:text-[var(--accent)]">
                      {b.name}
                    </a>
                  </td>
                  <td className="px-4 py-3 text-[var(--fg-soft)]">{b.region}</td>
                  <td className="px-4 py-3 text-[var(--fg-muted)]">{b.phone ?? "—"}</td>
                  <td className="px-4 py-3 text-[var(--fg-muted)]">{b.status ?? "수신"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {businesses.length > TABLE_PAGE ? (
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-sm text-[var(--fg-muted)]">
            <span>
              {(tablePage * TABLE_PAGE + 1).toLocaleString()}–
              {Math.min((tablePage + 1) * TABLE_PAGE, businesses.length).toLocaleString()} /{" "}
              {businesses.length.toLocaleString()}
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                className="btn-ghost min-h-9 px-3 text-sm"
                disabled={tablePage === 0}
                onClick={() => setTablePage((p) => Math.max(0, p - 1))}
              >
                이전
              </button>
              <button
                type="button"
                className="btn-ghost min-h-9 px-3 text-sm"
                disabled={tablePage >= pageCount - 1}
                onClick={() => setTablePage((p) => Math.min(pageCount - 1, p + 1))}
              >
                다음
              </button>
            </div>
          </div>
        ) : null}
      </section>

      {notices.length > 0 ? (
        <section>
          <h2 className="text-xl font-bold">
            유기동물 공고 {(status?.notices.length ?? 0).toLocaleString()}건
          </h2>
          <p className="mt-1 text-sm text-[var(--fg-muted)]">
            업체 명단이 아니라 보호 공고입니다. 아래는 일부만 미리보기입니다.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {notices.map((n) => (
              <article key={n.id} className="glow-card p-4">
                <p className="text-xs text-[var(--pet)]">{n.processState ?? "공고"}</p>
                <h3 className="mt-2 font-semibold">{n.kind}</h3>
                <p className="mt-1 text-sm text-[var(--fg-muted)]">{n.place || n.careNm}</p>
              </article>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}

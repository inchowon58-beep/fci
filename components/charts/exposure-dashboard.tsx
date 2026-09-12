"use client";

import { LineChart } from "@/components/charts/line-chart";
import { CountUp } from "@/components/charts/count-up";
import { featuredExposure, exposureSample } from "@/lib/exposure-preview";
import { cn } from "@/lib/cn";

function formatMan(value: number, target: number) {
  const man = target / 10_000;
  const current = value / 10_000;
  if (Number.isInteger(man)) return `${Math.round(current)}만`;
  return `${current.toFixed(1)}만`;
}

export function ExposureDashboardPreview({ className }: { className?: string }) {
  const data = featuredExposure;

  return (
    <div className={cn("exposure-dash flex flex-col overflow-hidden", className)}>
      <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-3">
        <div>
          <p className="text-[11px] font-semibold tracking-wide text-[var(--accent)]">
            웹마스터도구 · 콘텐츠 노출/클릭
          </p>
          <p className="mt-1 text-sm font-bold">
            {data.period} · {data.device}
          </p>
        </div>
        <p className="text-[11px] text-[var(--fg-muted)]">최근 업데이트 {data.updated}</p>
      </div>

      <div className="border-b border-[var(--border)] px-5 py-4 text-center">
        <p className="text-xs text-[var(--fg-muted)]">실행 사례 요약</p>
        <p className="mt-1 text-2xl font-extrabold tracking-tight text-[var(--accent)] sm:text-3xl">
          {data.headline}
        </p>
      </div>

      <div className="grid grid-cols-3 divide-x divide-[var(--border)] border-b border-[var(--border)]">
        <div className="px-3 py-4 sm:px-4">
          <p className="text-[11px] text-[var(--fg-muted)]">최근 총 노출</p>
          <p className="mt-1 text-xl font-extrabold tracking-tight text-[var(--accent)] sm:text-2xl">
            <CountUp
              value={data.impressions.value}
              format={(n) => formatMan(n, data.impressions.value)}
            />
          </p>
          <p className="mt-1 text-[11px] font-semibold text-[#ff6b8a]">
            지난구간 대비 {data.impressions.delta}
          </p>
        </div>
        <div className="px-3 py-4 sm:px-4">
          <p className="text-[11px] text-[var(--fg-muted)]">최근 총 클릭</p>
          <p className="mt-1 text-xl font-extrabold tracking-tight sm:text-2xl">
            <CountUp value={data.clicks.value} format={(n) => formatMan(n, data.clicks.value)} />
          </p>
          <p className="mt-1 text-[11px] font-semibold text-[#ff6b8a]">
            지난구간 대비 {data.clicks.delta}
          </p>
        </div>
        <div className="px-3 py-4 sm:px-4">
          <p className="text-[11px] text-[var(--fg-muted)]">평균 CTR</p>
          <p className="mt-1 text-xl font-extrabold tracking-tight sm:text-2xl">
            <CountUp value={data.ctr.value} format={(n) => `${n.toFixed(1)}%`} />
          </p>
          <p className="mt-1 text-[11px] text-[var(--accent-dim)]">
            지난구간 대비 {data.ctr.delta}
          </p>
        </div>
      </div>

      <div className="px-2 pb-2 pt-3 sm:px-3" style={{ minHeight: 240 }}>
        <LineChart
          impressions={[...data.impressionsSeries]}
          clicks={[...data.clicksSeries]}
          yMax={data.yMax}
          labels={[...data.labels]}
        />
      </div>

      <div className="flex items-center justify-between px-5 pb-4">
        <div className="flex items-center gap-4 text-[11px] text-[var(--fg-muted)]">
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-block size-2 rounded-full bg-[#60a5fa]" /> 노출
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-block size-2 rounded-full bg-[#f59e0b]" /> 클릭
          </span>
        </div>
        <p className="text-[11px] text-[var(--fg-muted)]">{exposureSample.partnerName} 실행 사례</p>
      </div>
    </div>
  );
}

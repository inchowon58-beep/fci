import { exposureSample } from "@/lib/exposure-preview";

/** 의정부애견미용학원 네이버 노출 예시 */
export function NaverSerpPreview() {
  return (
    <div className="naver-serp overflow-hidden rounded-2xl border border-[var(--border)] bg-[#f5f6f8] text-[#1a1a1a]">
      <div className="flex items-center justify-between gap-2 border-b border-[#e5e7eb] bg-white px-3 py-2.5">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <span
            className="inline-flex size-6 shrink-0 items-center justify-center rounded-md bg-[#03c75a] text-[11px] font-black text-white"
            aria-hidden
          >
            N
          </span>
          <div className="flex h-8 min-w-0 flex-1 items-center rounded-full border border-[#e5e7eb] bg-[#f8f9fa] px-3 text-xs font-medium text-[#222]">
            {exposureSample.keyword}
          </div>
        </div>
        <span className="shrink-0 rounded-full bg-[rgba(3,199,90,0.12)] px-2 py-1 text-[10px] font-semibold text-[#03c75a]">
          {exposureSample.label}
        </span>
      </div>
      <div className="px-3 py-3">
        <div className="rounded-xl border border-[rgba(3,199,90,0.25)] bg-white px-3 py-2.5 shadow-sm">
          <p className="text-[11px] font-semibold text-[#03c75a]">1위 · {exposureSample.siteName}</p>
          <p className="mt-0.5 text-sm font-bold text-[#1a73e8]">
            {exposureSample.keyword} | {exposureSample.siteName}
          </p>
          <p className="mt-1 text-[11px] leading-relaxed text-[#666]">
            네이버에서 ‘{exposureSample.keyword}’를 검색하면 {exposureSample.siteName} 사이트가 상단에
            노출되고 있습니다. 지금 운영 중인 실제 사례입니다.
          </p>
        </div>
      </div>
    </div>
  );
}

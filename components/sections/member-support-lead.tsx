import { ExposureDashboardPreview } from "@/components/charts/exposure-dashboard";
import { NaverSerpPreview } from "@/components/charts/naver-serp-preview";
import { exposureSample } from "@/lib/exposure-preview";

const MEMBER_SUPPORT_URL = "https://thekkf.infocs.co.kr/";

/** 메인 히어로 바로 위 — 정회원 지원 + 노출 그래프·검색 예시 */
export function MemberSupportLead() {
  return (
    <section className="member-support-lead relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 member-support-lead-glow" aria-hidden />
      <div className="container-bx relative member-support-lead-inner">
        <div className="grid items-stretch gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="flex flex-col">
            <p className="eyebrow mb-5">한국애견연맹 정회원 · 반려문화증진위원회</p>
            <h2 className="hero-brand max-w-4xl">
              <span className="hero-brand-line member-support-lead-title">애견연맹 정회원</span>
              <span className="hero-brand-line member-support-lead-title">사이트 무료 제작지원</span>
            </h2>
            <p className="mt-5 max-w-3xl text-xl font-semibold tracking-tight text-[var(--fg)] sm:text-2xl">
              회원 사업장이 온라인에서도 제대로 알려지도록 돕습니다
            </p>
            <p className="mt-4 max-w-2xl text-lg text-[var(--fg-soft)] leading-relaxed">
              반려문화증진위원회는 한국애견연맹 정회원이 홈페이지를 갖추고, 보호자에게 더 쉽게
              다가가도록 사이트 제작을 지원합니다. 실제 운영 사례 기준 최근 60일{" "}
              <strong className="text-[var(--fg)]">81만 노출 · 1만 클릭</strong>입니다.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={MEMBER_SUPPORT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
              >
                자세히보기
              </a>
            </div>

            <div className="mt-8">
              <p className="mb-3 text-xs font-semibold tracking-wide text-[var(--accent)]">
                노출 예시 · ‘{exposureSample.keyword}’
              </p>
              <NaverSerpPreview />
            </div>
          </div>

          <div className="flex min-h-0 flex-col">
            <ExposureDashboardPreview className="min-h-0 flex-1" />
          </div>
        </div>
      </div>
    </section>
  );
}

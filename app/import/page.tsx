import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ImportConsole } from "./import-console";

export const dynamic = "force-dynamic";

export default function ImportPage() {
  return (
    <>
      <SiteHeader />
      <main className="section-bx pt-16">
        <div className="container-bx">
          <p className="eyebrow mb-4">PUBLIC DATA · data.go.kr</p>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl">
            공공데이터에서 업체를 가져와 등록합니다
          </h1>
          <p className="mt-4 max-w-2xl text-[var(--fg-soft)]">
            키가 붙어 있는 데이터셋만 호출합니다. 로그에 한 줄씩 쌓이는 것이 실제 등록 과정입니다.
            활용신청이 안 된 데이터셋은 보류로 남습니다.
          </p>
          <div className="mt-10">
            <ImportConsole />
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Hero } from "@/components/sections/hero";
import { MemberSupportLead } from "@/components/sections/member-support-lead";
import { BrandAeo } from "@/components/sections/brand-aeo";
import { WhatIs } from "@/components/sections/what-is";
import { Numbers } from "@/components/sections/numbers";
import { Categories } from "@/components/sections/categories";
import { Partners } from "@/components/sections/partners";
import { Faq } from "@/components/sections/faq";
import { buildHomeJsonLd, buildHomeMetadata } from "@/lib/seo";
import { readCms } from "@/lib/cms";
/** ISR 1시간 — Next segment config는 리터럴만 허용 */
export const revalidate = 3600;

export const metadata: Metadata = buildHomeMetadata();

export default async function HomePage() {
  const cms = await readCms();
  const jsonLd = buildHomeJsonLd({
    phone: cms.kkf.committeePhone,
    email: cms.kkf.committeeEmail,
    address: cms.kkf.committeeAddress,
    siteUrl: cms.kkf.siteUrl,
    federationAddress: cms.kkf.federationAddress,
    federationEmail: cms.kkf.federationEmail,
    committeeAddress: cms.kkf.committeeAddress,
    committeePhone: cms.kkf.committeePhone,
    committeeEmail: cms.kkf.committeeEmail,
    chairperson: cms.kkf.chairperson,
    operator: cms.kkf.operator,
    org: cms.kkf.org,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SiteHeader />
      <main>
        <MemberSupportLead />
        <Hero />
        <BrandAeo />
        <WhatIs />
        <Categories />
        <Numbers />
        <Partners />
        <Faq />
      </main>
      <SiteFooter />
    </>
  );
}

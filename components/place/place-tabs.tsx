"use client";

import { useEffect, useState } from "react";

const TABS = [
  { href: "#summary", label: "요약" },
  { href: "#bxa_info", label: "정보" },
  { href: "#bxa_qa", label: "Q&A" },
  { href: "#bx_map", label: "위치" },
  { href: "#bxa_blog", label: "블로그" },
  { href: "#partners", label: "제휴" },
  { href: "#bxa_near", label: "주변" },
];

export function PlaceTabs() {
  const [on, setOn] = useState("#summary");

  useEffect(() => {
    const pairs = TABS.map((tab) => {
      const el = document.querySelector(tab.href);
      return el ? ([el, tab.href] as const) : null;
    }).filter((x): x is readonly [Element, string] => Boolean(x));

    const paint = () => {
      const y = window.scrollY + 96;
      let cur = TABS[0].href;
      for (const [el, href] of pairs) {
        const top = el.getBoundingClientRect().top + window.scrollY;
        if (top <= y) cur = href;
      }
      setOn(cur);
    };

    window.addEventListener("scroll", paint, { passive: true });
    paint();
    return () => window.removeEventListener("scroll", paint);
  }, []);

  return (
    <nav className="place-tabs" aria-label="섹션 바로가기">
      {TABS.map((tab) => (
        <a key={tab.href} href={tab.href} className={on === tab.href ? "on" : undefined}>
          {tab.label}
        </a>
      ))}
    </nav>
  );
}

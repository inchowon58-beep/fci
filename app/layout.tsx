import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/copy";
import { getSiteUrl } from "@/lib/seo";

const noto = Noto_Sans_KR({
  variable: "--font-pretendard",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: `${site.name} — 반려동물 동네 디렉터리`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  keywords: [
    "한국애견연맹",
    "반려문화증진위원회",
    "한국애견연맹 반려문화증진위원회",
    "사단법인 한국애견연맹",
    "동물병원",
    "응급동물병원",
    "펫샵",
    "애견미용",
    "펫호텔",
    "펫카페",
    "훈련소",
    "펫시터",
  ],
  icons: {
    icon: "/kkf/icon.png",
    apple: "/kkf/icon.png",
  },
  verification: {
    other: {
      "naver-site-verification": "7f0520ae6c1be823080b88d9a259bc3c314688cc",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${noto.variable} antialiased`}>{children}</body>
    </html>
  );
}

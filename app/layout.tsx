import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "개발자 성열",
  description: "매일의 공부를 기록합니다.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}

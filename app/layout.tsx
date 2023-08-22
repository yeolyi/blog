import Header from "./Header";
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
      <body className="bg-slate-900">
        <div className="min-h-screen py-8 overflow-hidden lg:py-12">
          <div
            className={`
            w-full px-6 py-12 
            md:max-w-3xl md:mx-auto 
            lg:max-w-4xl lg:pt-16 lg:pb-28
            `}
          >
            <div className="prose prose-invert lg:prose-lg mx-auto break-keep">
              <Header />
              {children}
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}

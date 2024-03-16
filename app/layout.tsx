import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '개발자 성열',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        {/* https://play.tailwindcss.com/uj1vGACRJA?layout=preview 참조 */}
        <main className="flex min-h-screen flex-col justify-center overflow-hidden bg-gray-50 py-8 lg:py-12">
          <div className="relative w-full bg-white px-6 py-12 shadow-xl shadow-slate-700/10 ring-1 ring-gray-900/5 md:mx-auto md:max-w-3xl lg:max-w-4xl lg:pb-28 lg:pt-16">
            <div className="prose prose-slate lg:prose-lg mx-auto mt-8">{children}</div>
          </div>
        </main>
      </body>
    </html>
  );
}

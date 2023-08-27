import Footer from './Footer';
import Header from './Header';
import './globals.css';
import type { Metadata } from 'next';
import localFont from 'next/font/local';

export const metadata: Metadata = {
  title: '개발자 성열',
  description: '매일의 공부를 기록합니다.',
};

const pretendard = localFont({
  src: '../public/PretendardVariable.woff2',
  weight: '45 920',
  style: 'normal',
  display: 'swap',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="ko"
      className={pretendard.className}
    >
      <body className="bg-slate-900">
        <div
          className={`
            min-h-screen py-16 overflow-hidden lg:py-20
            w-full px-6
            md:max-w-3xl md:mx-auto 
            lg:max-w-4xl
        `}
        >
          <div className="prose prose-invert lg:prose-lg mx-auto break-words selection:bg-pink-400">
            <Header />
            <div>{children}</div>
            <Footer />
          </div>
        </div>
      </body>
    </html>
  );
}

import Script from 'next/script';
import Footer from '../components/Footer';
import Header from '../components/Header';
import './globals.css';
import type { Metadata } from 'next';
import localFont from 'next/font/local';

export const metadata: Metadata = {
  title: '개발자 성열',
  description: '매일의 공부를 기록합니다.',
};

const pretendard = localFont({
  src: '../font/PretendardVariable.woff2',
  weight: '45 920',
  style: 'normal',
  display: 'swap',
  variable: '--font-pretendard',
});

const firaCode = localFont({
  src: '../font/FiraCode-VF.woff2',
  weight: '45 920',
  style: 'normal',
  display: 'swap',
  variable: '--font-firacode',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="ko"
      className={`${pretendard.variable} ${firaCode.variable} font-pretendard`}
    >
      <body className="bg-black">
        <div
          className={`
            min-h-screen py-16 overflow-hidden lg:py-20
            w-full px-6
            md:max-w-3xl md:mx-auto 
            lg:max-w-4xl
        `}
        >
          <div className="break-words selection:bg-pink-400 [&_hr]:border-white">{children}</div>
        </div>
      </body>
    </html>
  );
}

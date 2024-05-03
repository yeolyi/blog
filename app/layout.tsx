import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/react';
import localFont from 'next/font/local';
import { Fira_Code } from 'next/font/google';

import './globals.css';

export const metadata: Metadata = {
  title: '개발자 성열',
  description: '유익하고 바보같고 화가나는 개발자 일상',
};

const pretendard = localFont({
  src: '../fonts/PretendardVariable.woff2',
  display: 'swap',
  weight: '45 920',
  variable: '--font-pretendard',
});

const firaCode = Fira_Code({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-firacode',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${pretendard.variable} ${firaCode.variable} font-pretendard`}
    >
      <Analytics />
      <body>{children}</body>
    </html>
  );
}

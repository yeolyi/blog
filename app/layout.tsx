import './globals.css';

import { Analytics } from '@vercel/analytics/react';
import type { Metadata } from 'next';
import { Fira_Code } from 'next/font/google';
import localFont from 'next/font/local';

export const metadata: Metadata = {
  title: '개발자 성열',
  description: '유익하고 바보같고 화가나는 개발자 일상',
  metadataBase: new URL('https://yeolyi.com'),
};

// https://github.com/orioncactus/pretendard?tab=readme-ov-file
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
      className={`${pretendard.variable} ${firaCode.variable} break-keep font-pretendard`}
    >
      <Analytics />
      <body>{children}</body>
    </html>
  );
}

import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/react';

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
      <Analytics />
      <body>{children}</body>
    </html>
  );
}

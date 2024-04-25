import type { Metadata } from 'next';
import './globals.css';
import { SandPackCSS } from '@/components/sandpack-styles';

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
      <head>
        <SandPackCSS />
      </head>
      <body>{children}</body>
    </html>
  );
}

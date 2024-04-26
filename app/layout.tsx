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
      <body>{children}</body>
    </html>
  );
}

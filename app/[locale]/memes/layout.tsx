import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '밈 갤러리 | 개발자 성열',
};

export const dynamic = 'force-dynamic';

export default function MemesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

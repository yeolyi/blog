import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '물고기 잡기 | 개발자 성열',
};

export default function FindFishLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

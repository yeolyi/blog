import Footer from '@/components/Footer';
import '../globals.css';
import type { Metadata } from 'next';
import localFont from 'next/font/local';
import Header from '@/components/Header';

export const metadata: Metadata = {
  title: '개발자 성열',
  description: '매일의 공부를 기록합니다.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}

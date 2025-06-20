import { Analytics } from '@vercel/analytics/react';
import { IBM_Plex_Sans_KR } from 'next/font/google';
import Footer from '../../components/layout/Footer';
import Header from '../../components/layout/Header';

import '@/app/[locale]/globals.css';

import { AuthProvider } from '@/components/AuthProvider';
import SWRProvider from '@/components/SWRProvider';
import ScrollRetoration from '@/components/ScrollRestore';
import { SandPackCSS } from '@/components/layout/SandPackCSS';
import { routing } from '@/i18n/routing';
import { Provider as JotaiProvider } from 'jotai';
import { type Locale, NextIntlClientProvider, hasLocale } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import type * as React from 'react';
import { Suspense } from 'react';
import { Slide, ToastContainer } from 'react-toastify';

const ibmPlexSans = IBM_Plex_Sans_KR({
  variable: '--font-ibm-plex-sans',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;

  return {
    title: locale === 'ko' ? '이성열' : 'seongyeol Yi',
    description:
      locale === 'ko'
        ? '만든 것들과 배운 것들을 여기 공유해요'
        : 'I share what I make and learn here.',
  };
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: Locale }>;
}>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  return (
    <html
      lang={locale}
      className={`${ibmPlexSans.variable}`}
      style={{ scrollbarGutter: 'stable' }}
    >
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css"
          integrity="sha384-nB0miv6/jRmo5UMMR1wu3Gz6NLsoTkbqJghGIsx//Rlm+ZU03BU6SQNC66uf4l5+"
          crossOrigin="anonymous"
        />
        <SandPackCSS />
      </head>
      <body className="min-h-dvh flex flex-col">
        <NextIntlClientProvider>
          <JotaiProvider>
            <SWRProvider>
              <AuthProvider>
                {children}
                <Header />
                <Footer />
                <ToastContainer
                  position="bottom-right"
                  autoClose={5000}
                  hideProgressBar={false}
                  newestOnTop={false}
                  closeOnClick={false}
                  rtl={false}
                  pauseOnFocusLoss
                  pauseOnHover
                  theme="dark"
                  transition={Slide}
                />
              </AuthProvider>
            </SWRProvider>
          </JotaiProvider>
        </NextIntlClientProvider>
        <Analytics />
        <Suspense>
          <ScrollRetoration />
        </Suspense>
      </body>
    </html>
  );
}

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

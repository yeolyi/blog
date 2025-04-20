import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Metadata } from 'next';
import { IBM_Plex_Sans_KR } from 'next/font/google';
import Footer from './components/Footer';
import Header from './components/Header';

import '@/app/[locale]/globals.css';

import { routing } from '@/i18n/routing';
import { type Locale, NextIntlClientProvider, hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import type * as React from 'react';

const ibmPlexSans = IBM_Plex_Sans_KR({
  variable: '--font-ibm-plex-sans',
  subsets: ['latin'],
  weight: ['400', '600', '700'],
});

export const metadata: Metadata = {
  title: '개발자 성열',
};

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

  return (
    <html lang={locale} className={`${ibmPlexSans.variable}`}>
      <body>
        <NextIntlClientProvider>
          {children}
          <Header />
          <Footer />
        </NextIntlClientProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

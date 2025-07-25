import { Analytics } from '@vercel/analytics/react';
import Header from '../../components/layout/Header';

import '@/app/[locale]/globals.css';

// css가 script 태그로 들어가서 mdx 안에서 import해서 그런건가싶어서 여기로 이동
import '@xyflow/react/dist/style.css';

import { Provider as JotaiProvider } from 'jotai';
import localFont from 'next/font/local';
import { notFound } from 'next/navigation';
import { hasLocale, type Locale, NextIntlClientProvider } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { ThemeProvider } from 'next-themes';
import type * as React from 'react';
import { AuthProvider } from '@/app/[locale]/components/AuthProvider';
import SWRProvider from '@/app/[locale]/components/SWRProvider';
import MetaHandler from '@/app/[locale]/components/ThemeProvider';

import { routing } from '@/i18n/routing';

// css가 script 태그로 들어가는게 mdx 안에서 import해서 그런건가싶어서 여기로 이동
import 'medium-zoom/dist/style.css';
import { Toaster } from '@/components/ui/sonner';

const monoplexKR = localFont({
	src: './assets/MonoplexKR-Text.ttf',
	variable: '--font-monoplex-kr',
});

const pretendard = localFont({
	src: './assets/PretendardVariable.woff2',
	variable: '--font-pretendard',
});

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: Locale }>;
}) {
	const { locale } = await params;

	return {
		title: locale === 'ko' ? '이성열' : 'Seongyeol Yi',
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
			className={`${pretendard.variable} ${monoplexKR.variable}`}
			suppressHydrationWarning
		>
			<head>
				{/* https://github.com/pacocoursey/next-themes/issues/78#issuecomment-2927060208 */}
				<meta name='theme-color' content='var(--background)' />
			</head>
			<body className='min-h-dvh pb-24'>
				<ThemeProvider
					attribute='class'
					defaultTheme='system'
					enableSystem
					enableColorScheme
					// 이게 없으면 언어 전환간에 flashing이 일어난다...? 왜??
					disableTransitionOnChange
				>
					<NextIntlClientProvider>
						<JotaiProvider>
							<SWRProvider>
								<AuthProvider>
									<Header />
									{children}
									<MetaHandler />
									<Toaster />
								</AuthProvider>
							</SWRProvider>
						</JotaiProvider>
					</NextIntlClientProvider>
				</ThemeProvider>
				<Analytics />
			</body>
		</html>
	);
}

export async function generateStaticParams() {
	return routing.locales.map((locale) => ({ locale }));
}

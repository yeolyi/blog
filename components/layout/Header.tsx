'use client';

import {
	Github,
	Instagram,
	Loader2,
	LogOut,
	Menu,
	Moon,
	Sun,
	SunMoon,
} from 'lucide-react';
import { useParams } from 'next/navigation';
import type { Locale } from 'next-intl';
import { useLocale, useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Link, usePathname, useRouter } from '@/i18n/navigation';
import { useSessionStore } from '@/store/session';

function InstagramButton() {
	return (
		<div className='relative'>
			<Button variant='secondary' asChild>
				<Link href='https://instagram.com/yeol.dev' target='_blank'>
					<Instagram className='size-4' />
					22.9K
				</Link>
			</Button>
		</div>
	);
}

function DesktopHeaderActions() {
	const t = useTranslations('Header');
	const { session, isLoading, login, logout } = useSessionStore();
	const { theme, setTheme } = useTheme();
	const locale = useLocale();
	const router = useRouter();
	const pathname = usePathname();
	const params = useParams();

	function onLocaleChange(nextLocale: string) {
		if (!nextLocale) return;

		router.replace(
			// @ts-expect-error -- TypeScript will validate that only known `params`
			// are used in combination with a given `pathname`. Since the two will
			// always match for the current route, we can skip runtime checks.
			{ pathname, params },
			{ locale: nextLocale as Locale },
		);
	}

	return (
		<div className='hidden sm:flex items-center gap-3'>
			{/* 인스타그램 버튼 */}
			<InstagramButton />

			{/* 로그인/로그아웃 버튼 */}
			{session ? (
				<Button
					onClick={logout}
					type='button'
					variant='secondary'
					disabled={isLoading}
				>
					{isLoading ? <Loader2 className='animate-spin' /> : <LogOut />}
					{t('logout')}
				</Button>
			) : (
				<Button
					onClick={login}
					type='button'
					variant='secondary'
					disabled={isLoading}
				>
					{isLoading ? <Loader2 className='animate-spin' /> : <Github />}
					{t('login')}
				</Button>
			)}

			{/* 설정 메뉴 */}
			<DropdownMenu modal={false}>
				<DropdownMenuTrigger asChild>
					<Button variant='secondary' size='icon'>
						<Menu className='size-4' />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent className='w-40' align='end'>
					<DropdownMenuLabel>언어</DropdownMenuLabel>
					<DropdownMenuRadioGroup value={locale} onValueChange={onLocaleChange}>
						<DropdownMenuRadioItem value='ko'>한국어</DropdownMenuRadioItem>
						<DropdownMenuRadioItem value='en'>English</DropdownMenuRadioItem>
					</DropdownMenuRadioGroup>

					<DropdownMenuSeparator />

					<DropdownMenuLabel>테마</DropdownMenuLabel>
					<DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
						<DropdownMenuRadioItem value='light'>
							<Sun className='size-4 mr-2' />
							라이트
						</DropdownMenuRadioItem>
						<DropdownMenuRadioItem value='dark'>
							<Moon className='size-4 mr-2' />
							다크
						</DropdownMenuRadioItem>
						<DropdownMenuRadioItem value='system'>
							<SunMoon className='size-4 mr-2' />
							시스템
						</DropdownMenuRadioItem>
					</DropdownMenuRadioGroup>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}

function MobileHeaderActions() {
	const t = useTranslations('Header');
	const { session, isLoading, login, logout } = useSessionStore();
	const { theme, setTheme } = useTheme();
	const locale = useLocale();
	const router = useRouter();
	const pathname = usePathname();
	const params = useParams();

	function onLocaleChange(nextLocale: string) {
		if (!nextLocale) return;

		router.replace(
			// @ts-expect-error -- TypeScript will validate that only known `params`
			// are used in combination with a given `pathname`. Since the two will
			// always match for the current route, we can skip runtime checks.
			{ pathname, params },
			{ locale: nextLocale as Locale },
		);
	}

	return (
		<div className='sm:hidden flex items-center gap-3'>
			{/* 인스타그램 버튼 */}
			<InstagramButton />

			{/* 설정 메뉴 */}
			<DropdownMenu modal={false}>
				<DropdownMenuTrigger asChild>
					<Button variant='secondary' size='icon'>
						<Menu className='size-4' />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent className='w-40' align='end'>
					{/* 로그인/로그아웃 */}
					{session ? (
						<Button
							onClick={logout}
							type='button'
							variant='ghost'
							disabled={isLoading}
							className='w-full justify-start mb-2'
						>
							{isLoading ? (
								<Loader2 className='animate-spin size-4 mr-2' />
							) : (
								<LogOut className='size-4 mr-2' />
							)}
							{t('logout')}
						</Button>
					) : (
						<Button
							onClick={login}
							type='button'
							variant='ghost'
							disabled={isLoading}
							className='w-full justify-start mb-2'
						>
							{isLoading ? (
								<Loader2 className='animate-spin size-4 mr-2' />
							) : (
								<Github className='size-4 mr-2' />
							)}
							{t('login')}
						</Button>
					)}

					<DropdownMenuSeparator />

					<DropdownMenuLabel>언어</DropdownMenuLabel>
					<DropdownMenuRadioGroup value={locale} onValueChange={onLocaleChange}>
						<DropdownMenuRadioItem value='ko'>한국어</DropdownMenuRadioItem>
						<DropdownMenuRadioItem value='en'>English</DropdownMenuRadioItem>
					</DropdownMenuRadioGroup>

					<DropdownMenuSeparator />

					<DropdownMenuLabel>테마</DropdownMenuLabel>
					<DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
						<DropdownMenuRadioItem value='light'>
							<Sun className='size-4 mr-2' />
							라이트
						</DropdownMenuRadioItem>
						<DropdownMenuRadioItem value='dark'>
							<Moon className='size-4 mr-2' />
							다크
						</DropdownMenuRadioItem>
						<DropdownMenuRadioItem value='system'>
							<SunMoon className='size-4 mr-2' />
							시스템
						</DropdownMenuRadioItem>
					</DropdownMenuRadioGroup>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}

export default function Header() {
	const t = useTranslations('Header');

	return (
		<header className='sticky top-0 left-0 right-0 flex items-center p-4 bg-background z-50'>
			<Link
				href='/'
				className='text-foreground text-2xl font-bold no-underline mr-auto'
			>
				{t('title')}
			</Link>

			<div className='flex items-center gap-3'>
				<DesktopHeaderActions />
				<MobileHeaderActions />
			</div>
		</header>
	);
}

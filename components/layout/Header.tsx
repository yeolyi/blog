'use client';

import {
	Github,
	Globe,
	Instagram,
	Loader2,
	LogIn,
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
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Link, usePathname, useRouter } from '@/i18n/navigation';
import { useSessionStore } from '@/store/session';

function GithubButton() {
	return (
		<div className='relative'>
			<Button variant='ghost' asChild>
				<Link href='https://github.com/yeolyi' target='_blank'>
					<Github className='size-4' />
				</Link>
			</Button>
		</div>
	);
}

function InstagramButton() {
	return (
		<div className='relative'>
			<Button variant='ghost' asChild>
				<Link href='https://instagram.com/yeol.dev' target='_blank'>
					<Instagram className='size-4' />
				</Link>
			</Button>
		</div>
	);
}

function LoginButton({ className }: { className?: string }) {
	const { session, isLoading, login, logout } = useSessionStore();

	if (session) {
		return (
			<Button
				onClick={logout}
				type='button'
				variant='ghost'
				size='icon'
				disabled={isLoading}
				className={className}
			>
				{isLoading ? <Loader2 className='animate-spin ' /> : <LogOut />}
			</Button>
		);
	}

	return (
		<Button
			onClick={login}
			type='button'
			variant='ghost'
			size='icon'
			disabled={isLoading}
			className={className}
		>
			{isLoading ? <Loader2 className='animate-spin' /> : <LogIn />}
		</Button>
	);
}

function LanguageSettings() {
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
		<>
			<DropdownMenuLabel>언어</DropdownMenuLabel>
			<DropdownMenuRadioGroup value={locale} onValueChange={onLocaleChange}>
				<DropdownMenuRadioItem value='ko'>한국어</DropdownMenuRadioItem>
				<DropdownMenuRadioItem value='en'>English</DropdownMenuRadioItem>
			</DropdownMenuRadioGroup>
		</>
	);
}

function ThemeSettings() {
	const { theme, setTheme } = useTheme();

	return (
		<>
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
		</>
	);
}

function ThemeToggleButton() {
	const { theme, setTheme } = useTheme();
	const [isMounted, setIsMounted] = useState(false);

	// TODO: 이게 최선?
	useEffect(() => {
		setIsMounted(true);
	}, []);

	function toggleTheme() {
		if (theme === 'light') {
			setTheme('dark');
		} else if (theme === 'dark') {
			setTheme('system');
		} else {
			setTheme('light');
		}
	}

	function getIcon() {
		if (!isMounted) return <Loader2 className='animate-spin' />;
		if (theme === 'system') return <SunMoon />;
		if (theme === 'light') return <Sun />;
		if (theme === 'dark') return <Moon />;
		return <Loader2 className='animate-spin' />;
	}

	return (
		<Button
			variant='ghost'
			size='icon'
			onClick={toggleTheme}
			suppressHydrationWarning
		>
			{getIcon()}
		</Button>
	);
}

function LanguageToggleButton() {
	const locale = useLocale();
	const router = useRouter();
	const pathname = usePathname();
	const params = useParams();

	function toggleLanguage() {
		const nextLocale = locale === 'ko' ? 'en' : 'ko';
		router.replace(
			// @ts-expect-error -- TypeScript will validate that only known `params`
			// are used in combination with a given `pathname`. Since the two will
			// always match for the current route, we can skip runtime checks.
			{ pathname, params },
			{ locale: nextLocale as Locale },
		);
	}

	return (
		<Button variant='ghost' size='icon' onClick={toggleLanguage}>
			<Globe className='size-4' />
		</Button>
	);
}

function DesktopHeaderActions() {
	return (
		<div className='sm:flex hidden items-center gap-3'>
			<GithubButton />
			<InstagramButton />
			<LoginButton />
			<ThemeToggleButton />
			<LanguageToggleButton />
		</div>
	);
}

function MobileHeaderActions() {
	return (
		<div className='sm:hidden flex items-center gap-3'>
			{/* 인스타그램 버튼 */}
			<InstagramButton />

			{/* 로그인/로그아웃 버튼 */}
			<LoginButton />

			{/* 설정 메뉴 */}
			<DropdownMenu modal={false}>
				<DropdownMenuTrigger asChild>
					<Button variant='ghost' size='icon'>
						<Menu className='size-4' />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent className='w-40' align='end'>
					<DropdownMenuItem asChild>
						<Link
							href='https://github.com/yeolyi'
							target='_blank'
							className='flex items-center'
						>
							<Github className='size-4 mr-2' />
							깃허브
						</Link>
					</DropdownMenuItem>

					<DropdownMenuSeparator />

					<LanguageSettings />

					<DropdownMenuSeparator />

					<ThemeSettings />
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}

export default function Header() {
	const t = useTranslations('Header');

	return (
		<header className='sticky top-0 left-0 right-0 flex items-center justify-between py-7 px-4 z-50'>
			<Button variant='ghost' asChild>
				<Link href='/' className='font-extrabold pl-0'>
					{t('title')}
				</Link>
			</Button>

			<div className='flex items-center gap-3'>
				<DesktopHeaderActions />
				<MobileHeaderActions />
			</div>
		</header>
	);
}

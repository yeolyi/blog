'use client';

import {
	Github,
	Instagram,
	Loader2,
	LogIn,
	LogOut,
	Monitor,
	Moon,
	Settings,
	Sun,
	SunMoon,
} from 'lucide-react';
import { useParams } from 'next/navigation';
import type { Locale } from 'next-intl';
import { useLocale, useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';
import type * as React from 'react';
import { useState } from 'react';
import { useMediaQuery } from '@/components/hooks/useMediaQuery';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from '@/components/ui/drawer';
import { Separator } from '@/components/ui/separator';
import { Link, usePathname, useRouter } from '@/i18n/navigation';
import { cn } from '@/lib/utils';
import { useSessionStore } from '@/store/session';

function GithubButton() {
	return (
		<Button variant='ghost' asChild>
			<Link href='https://github.com/yeolyi' target='_blank'>
				<Github className='size-4' />
			</Link>
		</Button>
	);
}

function InstagramButton() {
	return (
		<Button variant='ghost' asChild>
			<Link href='https://instagram.com/yeol.dev' target='_blank'>
				<Instagram className='size-4' />
			</Link>
		</Button>
	);
}

function LoginButton() {
	const { session, isLoading, login, logout } = useSessionStore();
	const t = useTranslations('Header');

	return (
		<div className='space-y-2'>
			<div className='text-sm font-medium'>{t('auth')}</div>
			<div className='flex gap-2'>
				<Button
					onClick={session ? logout : login}
					type='button'
					variant='outline'
					size='icon'
					disabled={isLoading}
					className='flex-1'
				>
					{isLoading ? (
						<Loader2 className='animate-spin size-4' />
					) : session ? (
						<LogOut className='size-4' />
					) : (
						<Github className='size-4' />
					)}
				</Button>
			</div>
		</div>
	);
}

function LanguageSettings() {
	const locale = useLocale();
	const router = useRouter();
	const pathname = usePathname();
	const params = useParams();
	const t = useTranslations('Header');

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
		<div className='space-y-2'>
			<div className='text-sm font-medium'>{t('language')}</div>
			<div className='flex gap-2'>
				<Button
					variant={locale === 'ko' ? 'default' : 'outline'}
					size='icon'
					onClick={() => onLocaleChange('ko')}
					className='flex-1'
				>
					가
				</Button>
				<Button
					variant={locale === 'en' ? 'default' : 'outline'}
					size='icon'
					onClick={() => onLocaleChange('en')}
					className='flex-1'
				>
					A
				</Button>
			</div>
		</div>
	);
}

function ThemeSettings() {
	const { theme, setTheme } = useTheme();
	const t = useTranslations('Header');

	return (
		<div className='space-y-2'>
			<div className='text-sm font-medium'>{t('theme')}</div>
			<div className='flex gap-2'>
				<Button
					variant={theme === 'light' ? 'default' : 'outline'}
					size='icon'
					onClick={() => setTheme('light')}
					className='flex-1'
				>
					<Sun className='size-4' />
				</Button>
				<Button
					variant={theme === 'dark' ? 'default' : 'outline'}
					size='icon'
					onClick={() => setTheme('dark')}
					className='flex-1'
				>
					<Moon className='size-4' />
				</Button>
				<Button
					variant={theme === 'system' ? 'default' : 'outline'}
					size='icon'
					onClick={() => setTheme('system')}
					className='flex-1'
				>
					<Monitor className='size-4' />
				</Button>
			</div>
		</div>
	);
}

function SettingsContent({ className }: React.ComponentProps<'div'>) {
	return (
		<div className={cn('space-y-4 w-full mx-auto', className)}>
			<LanguageSettings />
			<ThemeSettings />
			<LoginButton />
		</div>
	);
}

function HeaderActions() {
	const isDesktop = useMediaQuery('(min-width: 640px)');
	const [open, setOpen] = useState(false);
	const t = useTranslations('Header');

	const trigger = (
		<Button variant='ghost' size='icon'>
			<Settings className='size-4' />
		</Button>
	);

	if (isDesktop) {
		return (
			<div className='flex items-center gap-3'>
				<GithubButton />
				<InstagramButton />

				<Dialog open={open} onOpenChange={setOpen}>
					<DialogTrigger asChild>{trigger}</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>{t('settings')}</DialogTitle>
						</DialogHeader>
						<SettingsContent />
					</DialogContent>
				</Dialog>
			</div>
		);
	}

	return (
		<div className='flex items-center gap-3'>
			<GithubButton />
			<InstagramButton />

			<Drawer open={open} onOpenChange={setOpen}>
				<DrawerTrigger asChild>{trigger}</DrawerTrigger>
				<DrawerContent>
					<DrawerHeader className='text-left'>
						<DrawerTitle>{t('settings')}</DrawerTitle>
					</DrawerHeader>
					<SettingsContent className='px-4 mb-7' />
				</DrawerContent>
			</Drawer>
		</div>
	);
}

export default function Header() {
	const t = useTranslations('Header');

	return (
		<header className='sticky top-0 left-0 right-0 flex items-center justify-between p-4 z-50'>
			<Button variant='ghost' asChild>
				<Link href='/' className='font-extrabold'>
					{t('title')}
				</Link>
			</Button>

			<HeaderActions />
		</header>
	);
}

'use client';

import {
	Github,
	Instagram,
	Loader2,
	LogOut,
	Monitor,
	Moon,
	Settings,
	Sun,
} from 'lucide-react';
import { useParams } from 'next/navigation';
import type { Locale } from 'next-intl';
import { useLocale, useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';
import IdentityIcon from '@/components/Identicon';
import { Button } from '@/components/ui/button';
import {
	ResponsiveDialog,
	ResponsiveDialogContent,
	ResponsiveDialogHeader,
	ResponsiveDialogTitle,
	ResponsiveDialogTrigger,
} from '@/components/ui/responsive-dialog';
import { Link, usePathname, useRouter } from '@/i18n/navigation';
import { useSessionStore } from '@/store/session';
import { tempUserId } from '@/store/tempUser';

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
				<IdentityIcon
					username={session?.user.id ?? tempUserId}
					// TODO: 높이 자연스럽게 맞추기...
					className='h-9 bg-primary rounded-full'
				/>
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

function SettingsContent() {
	return (
		<div className='space-y-4 w-full mx-auto px-4 mb-7'>
			<LanguageSettings />
			<ThemeSettings />
			<LoginButton />
		</div>
	);
}

function HeaderActions() {
	const t = useTranslations('Header');

	return (
		<div className='flex items-center gap-3'>
			<GithubButton />
			<InstagramButton />

			<ResponsiveDialog>
				<ResponsiveDialogTrigger asChild>
					<Button variant='ghost' size='icon'>
						<Settings className='size-4' />
					</Button>
				</ResponsiveDialogTrigger>
				<ResponsiveDialogContent>
					<ResponsiveDialogHeader className='text-left'>
						<ResponsiveDialogTitle>{t('settings')}</ResponsiveDialogTitle>
					</ResponsiveDialogHeader>
					<SettingsContent />
				</ResponsiveDialogContent>
			</ResponsiveDialog>
		</div>
	);
}

export default function Header() {
	const t = useTranslations('Header');

	return (
		<header className='flex items-center justify-between p-7'>
			<Link href='/' className='font-extrabold'>
				{t('title')}
			</Link>

			<HeaderActions />
		</header>
	);
}

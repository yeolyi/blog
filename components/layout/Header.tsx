'use client';
import ThemeToggle from '@/components/layout/ThemeToggle';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Link, usePathname, useRouter } from '@/i18n/navigation';
import { useSessionStore } from '@/store/session';
import { Github, Languages, Loader2, LogOut } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import type { Locale } from 'next-intl';
import { useParams } from 'next/navigation';

export default function Header() {
  const t = useTranslations('Header');
  const tLocale = useTranslations('LocaleSwitcher');
  const { session, isLoading, login, logout } = useSessionStore();

  // LocaleSwitcher 관련
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
    <header className="fixed top-0 left-0 right-0 flex items-center p-4">
      <Link
        href="/"
        className="text-foreground text-2xl font-bold no-underline mr-auto"
      >
        {t('title')}
      </Link>
      <div className="flex items-center gap-3">
        {session ? (
          <div className="flex items-center gap-3">
            <Button
              onClick={logout}
              type="button"
              variant="secondary"
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="animate-spin" /> : <LogOut />}
              {t('logout')}
            </Button>
          </div>
        ) : (
          <Button
            onClick={login}
            type="button"
            variant="secondary"
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="animate-spin" /> : <Github />}
            {t('login')}
          </Button>
        )}

        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary">
              <Languages className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-32">
            <DropdownMenuRadioGroup
              value={locale}
              onValueChange={onLocaleChange}
            >
              <DropdownMenuRadioItem value="ko">한국어</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="en">English</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <ThemeToggle />
      </div>
    </header>
  );
}

'use client';
import ThemeToggle from '@/components/layout/ThemeToggle';
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
import {
  Github,
  Languages,
  Loader2,
  LogOut,
  Moon,
  Settings,
  Sun,
  SunMoon,
} from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import type { Locale } from 'next-intl';
import { useTheme } from 'next-themes';
import { useParams } from 'next/navigation';

export default function Header() {
  const t = useTranslations('Header');
  const tLocale = useTranslations('LocaleSwitcher');
  const { session, isLoading, login, logout } = useSessionStore();
  const { theme, setTheme } = useTheme();

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
        {/* 로그인/로그아웃 버튼 - 데스크톱 */}
        {session ? (
          <Button
            onClick={logout}
            type="button"
            variant="secondary"
            disabled={isLoading}
            className="hidden sm:flex"
          >
            {isLoading ? <Loader2 className="animate-spin" /> : <LogOut />}
            {t('logout')}
          </Button>
        ) : (
          <Button
            onClick={login}
            type="button"
            variant="secondary"
            disabled={isLoading}
            className="hidden sm:flex"
          >
            {isLoading ? <Loader2 className="animate-spin" /> : <Github />}
            {t('login')}
          </Button>
        )}

        {/* 로그인/로그아웃 버튼 - 모바일 (아이콘만) */}
        {session ? (
          <Button
            onClick={logout}
            type="button"
            variant="secondary"
            disabled={isLoading}
            size="icon"
            className="sm:hidden"
          >
            {isLoading ? (
              <Loader2 className="animate-spin size-4" />
            ) : (
              <LogOut className="size-4" />
            )}
          </Button>
        ) : (
          <Button
            onClick={login}
            type="button"
            variant="secondary"
            disabled={isLoading}
            size="icon"
            className="sm:hidden"
          >
            {isLoading ? (
              <Loader2 className="animate-spin size-4" />
            ) : (
              <Github className="size-4" />
            )}
          </Button>
        )}

        {/* 데스크톱용 개별 버튼들 */}
        <div className="hidden sm:flex items-center gap-3">
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
                <DropdownMenuRadioItem value="en">
                  English
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <ThemeToggle />
        </div>

        {/* 모바일용 통합 설정 메뉴 */}
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="sm:hidden">
              <Settings className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-40" align="end">
            <DropdownMenuLabel>언어</DropdownMenuLabel>
            <DropdownMenuRadioGroup
              value={locale}
              onValueChange={onLocaleChange}
            >
              <DropdownMenuRadioItem value="ko">한국어</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="en">English</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>

            <DropdownMenuSeparator />

            <DropdownMenuLabel>테마</DropdownMenuLabel>
            <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
              <DropdownMenuRadioItem value="light">
                <Sun className="size-4 mr-2" />
                라이트
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="dark">
                <Moon className="size-4 mr-2" />
                다크
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="system">
                <SunMoon className="size-4 mr-2" />
                시스템
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

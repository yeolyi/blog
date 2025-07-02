'use client';
import ThemeToggle from '@/components/layout/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/navigation';
import { useSessionStore } from '@/store/session';
import { useProfile } from '@/swr/auth';
import { Github, Loader2, LogOut } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function Header() {
  const t = useTranslations('Header');
  const { session, isLoading, login, logout } = useSessionStore();
  const { data: profile } = useProfile();

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
              {t('developer', { number: profile?.registration_number ?? 0 })}
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
        <ThemeToggle />
      </div>
    </header>
  );
}

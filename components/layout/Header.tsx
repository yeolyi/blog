'use client';
import Button from '@/components/ui/Button';
import { Link } from '@/i18n/navigation';
import { useSessionStore } from '@/store/session';
import { useProfile } from '@/swr/auth';
import { Github, LogOut } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function Header() {
  const t = useTranslations('Header');
  const { session, isLoading, login, logout } = useSessionStore();
  const { data: profile } = useProfile();

  return (
    <header className="fixed top-0 left-0 right-0 flex justify-between items-center p-4">
      <Link href="/" className="text-[#e0e0e0] text-2xl font-bold no-underline">
        {t('title')}
      </Link>
      {session ? (
        <div className="flex items-center gap-3">
          <p className="text-stone-400">
            {t('developer', { number: profile?.registration_number ?? 0 })}
          </p>
          <Button
            bg="gray"
            Icon={LogOut}
            onClick={logout}
            type="button"
            isLoading={isLoading}
          />
        </div>
      ) : (
        <Button
          bg="gray"
          Icon={Github}
          onClick={login}
          type="button"
          isLoading={isLoading}
        >
          {t('login')}
        </Button>
      )}
    </header>
  );
}

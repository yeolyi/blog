'use client';
import Button from '@/components/ui/Button';
import { login, logout } from '@/db/auth';
import { Link } from '@/i18n/navigation';
import { useProfileStore } from '@/store/profile';
import { Github, LogOut } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function Header() {
  const t = useTranslations('Header');
  const { profile } = useProfileStore();
  const isLoggedIn = !!profile;

  return (
    <header className="fixed top-0 left-0 right-0 flex justify-between items-center p-4">
      <Link href="/" className="text-[#e0e0e0] text-2xl font-bold no-underline">
        {t('title')}
      </Link>
      {isLoggedIn ? (
        <Button theme="gray" Icon={LogOut} onClick={logout}>
          {t('logout')}
        </Button>
      ) : (
        <Button theme="gray" Icon={Github} onClick={login}>
          {t('login')}
        </Button>
      )}
    </header>
  );
}

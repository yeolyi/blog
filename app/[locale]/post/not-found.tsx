'use client';

import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';

export default function PostNotFound() {
  const t = useTranslations('NotFound');

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center px-4 flex-auto">
      <h1 className="mb-6 text-6xl font-bold text-white">404 Not Found</h1>
      <Link
        href="/"
        className="px-5 py-2.5 text-white font-medium hover:bg-white hover:text-black"
      >
        {t('backHome')}
      </Link>
    </div>
  );
}

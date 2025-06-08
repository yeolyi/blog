'use client';

import { ChevronLeft, ChevronRight, List } from 'lucide-react';

import { Link } from '@/i18n/navigation';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';

export default function PostNavigation({
  id,
  subDir,
  className,
  order,
}: {
  id: string;
  subDir: string;
  className?: string;
  order: string[];
}) {
  const t = useTranslations('PostNavigation');

  const currentIndex = order.indexOf(id);
  const prevPostIndex = currentIndex > 0 ? currentIndex - 1 : null;
  const nextPostIndex =
    currentIndex < order.length - 1 ? currentIndex + 1 : null;

  const prevPostId = prevPostIndex !== null ? order[prevPostIndex] : null;
  const nextPostId = nextPostIndex !== null ? order[nextPostIndex] : null;

  return (
    <div
      className={clsx(
        'flex gap-2 text-stone-300 text-base font-semibold *:hover:text-stone-400 *:active:text-stone-500',
        className,
      )}
    >
      {prevPostId ? (
        <Link
          href={`/${subDir}/${prevPostId}`}
          className="flex items-center gap-1 flex-1 justify-start"
        >
          <ChevronLeft size={16} />
          <span>{t('prev')}</span>
        </Link>
      ) : (
        <div className="flex-1" />
      )}

      <Link
        href={`/${subDir}`}
        className="flex items-center gap-1 justify-center flex-1justify-center"
      >
        <List size={16} />
        {t('backToList')}
      </Link>

      {nextPostId ? (
        <Link
          href={`/${subDir}/${nextPostId}`}
          className="flex items-center gap-1 flex-1 justify-end"
        >
          <span>{t('next')}</span>
          <ChevronRight size={16} />
        </Link>
      ) : (
        <div className="flex-1" />
      )}
    </div>
  );
}

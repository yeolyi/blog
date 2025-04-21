'use client';

import { usePathname, useRouter } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import * as ToggleGroup from '@radix-ui/react-toggle-group';
import clsx from 'clsx';
import { useLocale, useTranslations } from 'next-intl';
import type { Locale } from 'next-intl';
import { useParams } from 'next/navigation';
import { useTransition } from 'react';

export default function LocaleSwitcher() {
  const t = useTranslations('LocaleSwitcher');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();

  function onValueChange(nextLocale: string) {
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
    <div className="relative">
      <p className="sr-only">{t('label')}</p>
      <ToggleGroup.Root
        type="single"
        value={locale}
        onValueChange={onValueChange}
        className="inline-flex border border-white"
      >
        {routing.locales.map((cur) => (
          <ToggleGroup.Item
            key={cur}
            value={cur}
            className={clsx(
              'text-white px-2 py-1 text-sm font-semibold cursor-pointer',
              'data-[state=on]:bg-white data-[state=on]:text-black',
              'hover:bg-white hover:text-black',
            )}
          >
            {t('locale', { locale: cur })}
          </ToggleGroup.Item>
        ))}
      </ToggleGroup.Root>
    </div>
  );
}

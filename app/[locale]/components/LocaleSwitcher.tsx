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
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();
  const params = useParams();

  function onValueChange(nextLocale: string) {
    if (!nextLocale) return;

    startTransition(() => {
      router.replace(
        // @ts-expect-error -- TypeScript will validate that only known `params`
        // are used in combination with a given `pathname`. Since the two will
        // always match for the current route, we can skip runtime checks.
        { pathname, params },
        { locale: nextLocale as Locale, scroll: false },
      );
    });
  }

  return (
    <div className="relative">
      <p className="sr-only">{t('label')}</p>
      <ToggleGroup.Root
        type="single"
        value={locale}
        onValueChange={onValueChange}
        disabled={isPending}
        className="inline-flex"
      >
        {routing.locales.map((cur) => (
          <ToggleGroup.Item
            key={cur}
            value={cur}
            className={clsx(
              'text-[#5e5e5e] px-2 py-1 text-md font-semibold cursor-pointer',
              'data-[state=on]:bg-black data-[state=on]:text-white',
              'hover:bg-black hover:text-white',
              isPending && 'opacity-30',
            )}
          >
            {t('locale', { locale: cur })}
          </ToggleGroup.Item>
        ))}
      </ToggleGroup.Root>
    </div>
  );
}

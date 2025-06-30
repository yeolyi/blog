'use client';

import { Button } from '@/components/ui/button';
import { usePathname, useRouter } from '@/i18n/navigation';
import { useLocale, useTranslations } from 'next-intl';
import type { Locale } from 'next-intl';
import { useParams } from 'next/navigation';

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
    <div className="flex items-center gap-2">
      {locale !== 'ko' && (
        <Button variant="link" onClick={() => onValueChange('ko')}>
          한국어
        </Button>
      )}
      {locale !== 'en' && (
        <Button variant="link" onClick={() => onValueChange('en')}>
          English
        </Button>
      )}
    </div>
  );
}

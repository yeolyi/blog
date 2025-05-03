import LocaleSwitcher from '@/app/[locale]/components/layout/LocaleSwitcher';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';

export default function Footer() {
  const t = useTranslations('Footer');

  return (
    <footer className="p-6 flex flex-wrap gap-4 mx-auto">
      <p className="text-gray-400 whitespace-pre text-xs">
        <Link
          href="/"
          className="text-[#e0e0e0] font-bold no-underline text-xl"
        >
          {t('title')}
        </Link>
        {'   '}
        {t('copyright', { year: new Date().getFullYear() })}
      </p>
      <LocaleSwitcher />
    </footer>
  );
}

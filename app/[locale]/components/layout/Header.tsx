import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';

export default function Header() {
  const t = useTranslations('Header');

  return (
    <header className="fixed top-0 left-0 right-0 flex justify-between items-center p-4">
      <Link href="/" className="text-[#e0e0e0] text-2xl font-bold no-underline">
        {t('title')}
      </Link>
    </header>
  );
}

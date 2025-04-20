import LocaleSwitcher from '@/app/[locale]/components/LocaleSwitcher';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';

export default function Footer() {
  const t = useTranslations('Footer');

  return (
    <footer className="w-full py-6 mt-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-gray-400 whitespace-pre text-xs mr-auto">
            <Link
              href="/"
              className="text-[#e0e0e0] font-bold no-underline text-xl"
            >
              {t('title')}
            </Link>
            {'   '}
            {t('copyright', { year: new Date().getFullYear() })}
          </p>

          <ul className="flex flex-row gap-4 mr-4">
            <li>
              <a
                href="https://github.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-gray-400 text-sm font-semibold"
              >
                GitHub
              </a>
            </li>
            <li>
              <a
                href="https://www.instagram.com/yeol.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-gray-400 text-sm font-semibold"
              >
                Instagram
              </a>
            </li>
          </ul>
          <LocaleSwitcher />
        </div>
      </div>
    </footer>
  );
}

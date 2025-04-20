import LocaleSwitcher from '@/app/[locale]/components/LocaleSwitcher';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';

export default function Footer() {
  const t = useTranslations('Footer');

  return (
    <footer className="w-full py-6 mt-12 border-t border-[#5e5e5e]">
      <div className="container mx-auto px-4">
        <div className="flex flex-row justify-between items-center">
          <div>
            <Link href="/" className="text-[#e0e0e0] font-bold no-underline">
              {t('title')}
            </Link>
            <p className="text-gray-400 mt-1 text-sm">
              {t('copyright', { year: new Date().getFullYear() })}
            </p>
          </div>

          <ul className="flex flex-row gap-4">
            <li>
              <a
                href="https://github.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white text-sm"
              >
                GitHub
              </a>
            </li>
            <li>
              <a
                href="https://www.instagram.com/yeol.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white text-sm"
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

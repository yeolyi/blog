'use client';

import Image from 'next/image';
import Me from '@/public/me.jpg';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function Header() {
  const pathName = usePathname();

  return (
    <header className="flex flex-col items-start justify-between gap-1 mb-4 sm:flex-row sm:items-end">
      <Link
        href="/"
        className="no-underline"
      >
        <h2 className="text-3xl font-bold text-white">YeolYi</h2>
      </Link>
      {pathName !== '/' && (
        <div className="flex gap-4">
          <NavAnchor
            href="/about"
            current={pathName === '/about'}
            text="About"
          />
          <NavAnchor
            href="/article"
            current={pathName.startsWith('/article')}
            text="Article"
          />
          <NavAnchor
            href="/docs"
            current={pathName.startsWith('/docs')}
            text="Docs"
          />
        </div>
      )}
    </header>
  );
}

const NavAnchor = ({ text, current, href }: { text: string; current: boolean; href: string }) => {
  return (
    <Link
      href={href}
      className={`text-slate-300 text-base font-medium ${current && 'underline'}`}
    >
      {text}
    </Link>
  );
};

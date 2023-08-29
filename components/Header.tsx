'use client';

import Image from 'next/image';
import Me from '@/public/me.jpg';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function Header() {
  const pathName = usePathname();

  return (
    <header className="not-prose flex gap-4 items-center mb-12 font-firacode">
      <a href="/">
        <Image
          src={Me}
          alt="주인장 사진"
          width={80}
          height={80}
          className="m-0 object-contain"
          priority
        />
      </a>

      <div className="flex flex-col gap-1">
        <a
          href="/"
          className="no-underline"
        >
          <h2 className="text-3xl font-bold text-white">YeolYi</h2>
        </a>
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
      </div>
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

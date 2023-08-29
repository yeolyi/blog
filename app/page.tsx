import { ReactNode } from 'react';

export default function Home() {
  return (
    <p className="font-firacode text-[4rem] m-0 flex flex-col gap-6 leading-none">
      <Anchor
        key="0"
        href="/about"
      >
        About <span className="group-hover:hidden">{'=='}</span>
        <span className="hidden group-hover:inline">{'!='}</span>
      </Anchor>
      <Anchor
        key="1"
        href="/article"
      >
        Article <span className="group-hover:hidden">{'[({'}</span>
        <span className="hidden group-hover:inline">{'})]'}</span>
      </Anchor>
      <Anchor
        key="2"
        href="/docs"
      >
        Docs <span className="group-hover:hidden">{'>>-->'}</span>
        <span className="hidden group-hover:inline">{'<--<<'}</span>
      </Anchor>
    </p>
  );
}

const Anchor = ({ href, children }: { href: string; children: ReactNode }) => (
  <a
    href={href}
    className="no-underline hover:text-[#E9390B] text-white group"
  >
    {children}
  </a>
);

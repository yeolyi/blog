import { ReactNode } from 'react';
import ContributionGraph from './ContrubutionGraph';

export default function Home() {
  return (
    <div className="not-prose flex flex-col gap-16">
      <p className="font-firacode text-[4rem] m-0 flex flex-col gap-6 leading-none font-semibold">
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
          Article <span className="group-hover:hidden">{'/*'}</span>
          <span className="hidden group-hover:inline">{'*/'}</span>
        </Anchor>
        <Anchor
          key="2"
          href="/docs"
        >
          Docs <span className="group-hover:hidden">{'>>-->'}</span>
          <span className="hidden group-hover:inline">{'<--<<'}</span>
        </Anchor>
      </p>
      <ContributionGraph />
    </div>
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

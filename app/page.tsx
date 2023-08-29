import { ReactNode } from 'react';
import ContributionGraph from './ContrubutionGraph';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="not-prose flex flex-col gap-16">
      <p className="font-firacode text-5xl m-0 flex flex-col gap-6 leading-none font-semibold">
        <Anchor
          key="0"
          href="/about"
        >
          About <span className="group-hover:hidden text-slate-300">{'=='}</span>
          <span className="hidden group-hover:inline text-slate-300">{'!='}</span>
        </Anchor>
        <Anchor
          key="1"
          href="/article"
        >
          <span className="group-hover:hidden text-slate-300">{'/*'}</span>
          <span className="hidden group-hover:inline text-slate-300">{'*/'}</span> Article
        </Anchor>
        <Anchor
          key="2"
          href="/docs"
        >
          Docs <span className="group-hover:hidden text-slate-300">{'>>-->'}</span>
          <span className="hidden group-hover:inline text-slate-300">{'<--<<'}</span>
        </Anchor>
      </p>
      <ContributionGraph />
    </div>
  );
}

const Anchor = ({ href, children }: { href: string; children: ReactNode }) => (
  <Link
    href={href}
    className="no-underline hover:text-[#E9390B] text-white group self-start"
  >
    {children}
  </Link>
);

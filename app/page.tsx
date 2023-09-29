import { ReactNode } from 'react';
import ContributionGraph from './ContrubutionGraph';
import Link from 'next/link';
import Image from 'next/image';
import Me from '@/public/me.jpg';

export default function Home() {
  return (
    <div className="not-prose flex flex-col gap-12">
      <div>
        <Image
          src={Me}
          alt="주인장 사진"
          width={200}
          height={200}
          className="m-0 object-contain"
          priority
        />
        <h2 className="text-6xl sm:text-8xl text-white font-semibold mt-[-3rem] sm:mt-[-4rem]">
          YeolYi
        </h2>
        <p className="text-white break-keep">배우고 익히는 재미로 사는 개발자 이성열입니다.</p>
      </div>

      <div className="flex gap-4 text-white underline text-xl font-bold">
        <Link href="https://github.com/yeolyi">GitHub</Link>
        <Link href="https://instagram.com/yeolyii">Instagram</Link>
        <Link href="https://solved.ac/profile/yeolyii">solved.ac</Link>
      </div>

      <div className="flex gap-4 text-white underline text-xl font-bold">
        <a
          className="underline text-white"
          href="https://cse-dev-waffle.bacchus.io"
        >
          컴공 리뉴얼 사이트 오픈 베타
        </a>
      </div>

      <hr />

      <p className="text-5xl m-0 p-4 flex flex-col gap-6 leading-none font-semibold bg-orange text-black items-start">
        <Anchor href="/about">About</Anchor>
        <Anchor href="/article">Article</Anchor>
        <Anchor href="/docs">Docs</Anchor>
      </p>

      <hr />

      <ContributionGraph />
    </div>
  );
}

const Anchor = ({ href, children }: { href: string; children: ReactNode }) => (
  <Link
    href={href}
    className="underline"
  >
    {children}
  </Link>
);

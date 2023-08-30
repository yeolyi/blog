import { ReactNode } from 'react';
import ContributionGraph from './ContrubutionGraph';
import Link from 'next/link';
import Image from 'next/image';
import Me from '@/public/me.jpg';
import { GitHub, Icon, Instagram, Shield } from 'react-feather';

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

      <div className="flex justify-end gap-4">
        <IconAnchor
          Icon={GitHub}
          href="https://github.com/yeolyi"
        />
        <IconAnchor
          Icon={Instagram}
          href="https://instagram.com/yeolyii"
        />
        <IconAnchor
          Icon={Shield}
          href="https://solved.ac/profile/yeolyii"
        />
      </div>

      <hr />

      <p className="text-5xl m-0 p-4 flex flex-col gap-6 leading-none font-semibold bg-orange text-black items-start">
        <Anchor
          key="0"
          href="/about"
        >
          About
        </Anchor>
        <Anchor
          key="1"
          href="/article"
        >
          Article
        </Anchor>
        <Anchor
          key="2"
          href="/docs"
        >
          Docs
        </Anchor>
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

const IconAnchor = ({ Icon, href }: { Icon: Icon; href: string }) => {
  return (
    <a
      className="no-underline"
      href={href}
      target="__blank"
    >
      <Icon
        size="2rem"
        stroke="white"
        strokeWidth={2}
      />
    </a>
  );
};

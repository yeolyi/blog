'use client';

import Image from 'next/image';

import { Tile } from '@/components/gallery/Tile';
import jsbook from '@/public/jsbook.png';

export default function JSBookTile() {
  return (
    <Tile
      name="소개"
      description="JS를 복습하며 몰랐었고 흥미로웠던 내용 위주로 기록했습니다. 아래 책으로 공부했어요."
      style={{
        backgroundImage: `linear-gradient(
        163deg,
    hsl(51deg 97% 59%) 1%,
    hsl(50deg 93% 58%) 51%,
    hsl(49deg 90% 56%) 49%,
    hsl(48deg 86% 54%) 99%
  )`,
      }}
      textColor="text-textblack"
    >
      <div className="overflow-hidden rounded-[13px]">
        <Image src={jsbook} alt="자바스크립트 책 표지" />
      </div>
    </Tile>
  );
}

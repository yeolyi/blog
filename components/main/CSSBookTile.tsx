'use client';

import Image from 'next/image';

import { Tile } from '@/components/gallery/Tile';
import cssbook from '@/public/cssbook.png';

export default function CSSBookTile() {
  return (
    <Tile
      name="소개"
      description="CSS를 복습하며 몰랐었고 흥미로웠던 내용 위주로 기록했습니다. 아래 책으로 공부했어요."
      style={{
        backgroundImage: `linear-gradient(
  45deg,
  hsl(228deg 78% 52%) 1%,
  hsl(226deg 82% 53%) 51%,
  hsl(224deg 85% 54%) 49%,
  hsl(222deg 88% 55%) 99%
)`,
      }}
      textColor="text-white"
    >
      <div className="overflow-hidden rounded-[13px]">
        <Image src={cssbook} alt="CSS 책 표지" />
      </div>
    </Tile>
  );
}

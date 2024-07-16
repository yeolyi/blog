'use client';

import Image from 'next/image';
import cssbook from '@/public/cssbook.png';
import { useEffect, useRef } from 'react';
import UniversalTilt from '@/components/gallery/tilt';
import { Tile } from '@/components/gallery/Tile';

export default function CSSBookTile() {
  let imageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let cur = imageRef.current;
    if (cur === null) return;

    UniversalTilt.init({
      elements: cur,
      settings: { shine: true, 'shine-opacity': 0.7, reverse: true },
    });
    // @ts-expect-error
    return () => cur.universalTilt.destroy();
  }, []);

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
      <div ref={imageRef} className="overflow-hidden rounded-[13px]">
        <Image src={cssbook} alt="CSS 책 표지" />
      </div>
    </Tile>
  );
}

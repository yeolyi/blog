'use client';

import Image from 'next/image';
import { Tile } from './Tile';
import jsbook from '@/public/jsbook.png';
import { useEffect, useRef } from 'react';
import UniversalTilt from './tilt';

export default function JSBookTile() {
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
    >
      <div ref={imageRef} className="overflow-hidden rounded-[13px]">
        <Image src={jsbook} alt="자바스크립트 책 표지" />
      </div>
    </Tile>
  );
}

'use client';

import Image from 'next/image';
import { Tile } from './Tile';
import jsbook from '@/public/jsbook.png';
import { useEffect, useRef } from 'react';
import VanillaTilt from './tilt';

export default function JSBookTile() {
  let imageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let cur = imageRef.current;
    if (cur === null) return;

    VanillaTilt.init(cur, { glare: true, 'max-glare': 0.5 });
    // @ts-expect-error
    return () => cur.vanillaTilt.destroy();
  }, []);

  return (
    <Tile
      name="소개"
      description="JS를 복습하며 기초적인 내용보다는 흥미롭고 지엽적인 내용 위주로 기록했습니다. 아래 책으로 공부했어요."
      content={
        <div ref={imageRef} className="overflow-hidden rounded-[13px]">
          <Image src={jsbook} alt="자바스크립트 책 표지" />
        </div>
      }
    />
  );
}

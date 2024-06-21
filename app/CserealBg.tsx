import Image from 'next/image';
import { MouseEventHandler } from 'react';
import cserealbg from '@/public/cserealbg.png';
import gsap from 'gsap';

const ROW = 6;
const COL = 8;
const RADIUS = 10;
const CENTER_SCALE = 1.8;
const COEF = 1.5;
const ROW_OFFSET = [0, 1, -1, 0, 1, 0];
const DURATION = 0.15;

export const CserealBg = () => {
  let code = [...'SNUCSE']
    .map((x) =>
      [...x.charCodeAt(0).toString(2).padStart(8, '0')].map((x) => x === '1'),
    )
    .reduce((acc, cur) => acc.concat(cur), []);

  const handleMouseOver: MouseEventHandler<HTMLDivElement> = (e) => {
    const target = e.target;
    if (target instanceof HTMLDivElement === false) return;
    e.stopPropagation();

    const idx = [...target.parentElement!.children].indexOf(target);

    const m = Math.floor(idx / COL);
    const n = idx % COL;

    for (let i = -RADIUS; i <= RADIUS; i++) {
      for (let j = -RADIUS; j <= RADIUS; j++) {
        if (i == 0 && j == 0) continue;

        const m2 = m + i;
        const n2 = n + j;
        if (m2 < 0 || n2 < 0 || ROW <= m2 || COL <= n2) continue;

        const dist =
          (m - m2) ** 2 + (n + ROW_OFFSET[m] - (n2 + ROW_OFFSET[m2])) ** 2;
        const scale = 1 + (CENTER_SCALE - 1) / (dist * COEF);
        const idx2 = m2 * COL + n2;

        const target2 = target.parentElement!.children[idx2];
        gsap.to(target2.firstChild, {
          scale,
          duration: DURATION,
          ease: 'sine.inOut',
        });
      }
    }

    gsap.to(target.firstChild, {
      scale: CENTER_SCALE,
      duration: DURATION,
      ease: 'sine.inOut',
    });
  };

  const handleMouseOut: MouseEventHandler<HTMLDivElement> = (e) => {
    const target = e.target;
    if (target instanceof HTMLDivElement === false) return;
    e.stopPropagation();

    [...target.parentElement!.children].forEach((child) =>
      gsap.to(child.firstChild, {
        scale: 1,
        duration: DURATION,
        ease: 'sine.inOut',
      }),
    );
  };

  return (
    <div className="relative h-full w-full">
      <Image
        src={cserealbg}
        className="object-cover"
        alt=""
        quality={100}
        fill
      />
      <div className="csereal-tile-graphic">
        {code.map((x, idx) =>
          x ? (
            <Rectangle
              key={idx}
              onMouseOver={handleMouseOver}
              onMouseOut={handleMouseOut}
            />
          ) : (
            <Circle
              key={idx}
              onMouseOver={handleMouseOver}
              onMouseOut={handleMouseOut}
            />
          ),
        )}
      </div>
    </div>
  );
};

const Circle = ({
  onMouseOver,
  onMouseOut,
}: {
  onMouseOver: MouseEventHandler<HTMLDivElement>;
  onMouseOut: MouseEventHandler<HTMLDivElement>;
}) => (
  <div onMouseOver={onMouseOver} onMouseOut={onMouseOut}>
    <svg xmlns="http://www.w3.org/2000/svg" fill="none">
      <circle cx="50%" cy="50%" r="40%" fill="#E75015" />
    </svg>
  </div>
);

const Rectangle = ({
  onMouseOver,
  onMouseOut,
}: {
  onMouseOver: MouseEventHandler<HTMLDivElement>;
  onMouseOut: MouseEventHandler<HTMLDivElement>;
}) => (
  <div onMouseOver={onMouseOver} onMouseOut={onMouseOut}>
    <svg xmlns="http://www.w3.org/2000/svg" fill="none">
      <rect x="5.92188" width="50%" height="100%" fill="#EA751A" />
    </svg>
  </div>
);

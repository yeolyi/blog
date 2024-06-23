'use client';

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
      <div className="csereal-tile-graphic relative mx-auto grid w-fit grid-cols-8 pt-[120px] sm:pt-[90px] md:pt-[60px]">
        {code.map((x, idx) => {
          let row = Math.floor(idx / COL);
          return (
            <div
              onMouseOver={handleMouseOver}
              onMouseOut={handleMouseOut}
              key={idx}
              className="flex h-[calc(2*var(--unit-size))] w-[calc(2*var(--unit-size))] items-center justify-center ease-in-out"
              style={{
                transition: 'transform 0.2s',
                transform:
                  row === 1 || row === 4
                    ? 'translateX(calc(var(--unit-size) * 2))'
                    : row === 2
                      ? 'translateX(calc(-1 * var(--unit-size) * 2))'
                      : '',
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                className="pointer-events-none h-[var(--unit-size)] w-[var(--unit-size)] will-change-transform"
              >
                {x ? (
                  <rect x="25%" width="50%" height="100%" fill="#EA751A" />
                ) : (
                  <circle cx="50%" cy="50%" r="40%" fill="#E75015" />
                )}
              </svg>
            </div>
          );
        })}
      </div>
    </div>
  );
};

import { MouseEventHandler, useCallback, useEffect, useRef } from 'react';

import cserealbg from '../assets/bg.png';

import gsap from 'gsap';
import { throttle } from 'es-toolkit';

const ROW = 6;
const COL = 8;
const RADIUS = Math.max(ROW, COL);
const CENTER_SCALE = 1.5;
const ROW_OFFSET = [0, 1, -1, 0, 1, 0];
const DURATION = 0.15;

const getDist = (m1: number, n1: number, m2: number, n2: number) => {
  return (m1 - m2) ** 2 + (n1 + ROW_OFFSET[m1] - (n2 + ROW_OFFSET[m2])) ** 2;
};

const ripple = throttle((idx: number, elementList: Element[]) => {
  const m = Math.floor(idx / COL);
  const n = idx % COL;

  for (let i = -RADIUS; i <= RADIUS; i++) {
    for (let j = -RADIUS; j <= RADIUS; j++) {
      if (i === 0 && j === 0) continue;

      const m2 = m + i;
      const n2 = n + j;
      if (m2 < 0 || n2 < 0 || ROW <= m2 || COL <= n2) continue;

      const dist = getDist(m, n, m2, n2);
      const idx2 = m2 * COL + n2;

      const target2 = elementList[idx2];
      gsap.to(target2, {
        scale: CENTER_SCALE,
        duration: DURATION,
        delay: dist / 50,
      });
      gsap.to(target2, {
        scale: 1,
        duration: DURATION,
        delay: dist / 50 + 0.2,
      });
    }
  }

  gsap.to(elementList[idx], {
    scale: 0.8,
    duration: DURATION,
  });

  gsap.to(elementList[idx], {
    scale: 1,
    duration: DURATION,
    delay: 0.2,
  });
}, 500);

export const CserealBg = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const lastRippleRef = useRef(0);

  const code = [...'SNUCSE']
    .map((x) =>
      [...x.charCodeAt(0).toString(2).padStart(8, '0')].map((x) => x === '1'),
    )
    .reduce((acc, cur) => acc.concat(cur), []);

  const handleMouseOver: MouseEventHandler<HTMLDivElement> = useCallback(
    (e) => {
      if (containerRef.current === null) return;
      if (e.target instanceof HTMLDivElement === false) return;
      e.stopPropagation();

      const childList = [...containerRef.current.children];
      const idx = childList.indexOf(e.target);

      lastRippleRef.current = Date.now();
      ripple(
        idx,
        childList.map((child) => child.firstElementChild!),
      );
    },
    [],
  );

  useEffect(() => {
    const id = setInterval(() => {
      if (containerRef.current && Date.now() - lastRippleRef.current > 5000)
        ripple(
          Math.floor(Math.random() * (COL * ROW - 1)),
          [...containerRef.current.children].map(
            (child) => child.firstElementChild!,
          ),
        );
    }, 4000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative h-full w-full">
      <img
        src={cserealbg}
        className="absolute bottom-0 left-0 right-0 top-0 h-full w-full object-cover"
      />
      <div
        className="csereal-tile-graphic relative mx-auto grid w-fit select-none grid-cols-8 pt-[120px] sm:pt-[90px] md:pt-[60px]"
        ref={containerRef}
      >
        {code.map((x, idx) => {
          const row = Math.floor(idx / COL);
          return (
            <div
              onClick={handleMouseOver}
              key={idx}
              className="flex h-[calc(2*var(--unit-size))] w-[calc(2*var(--unit-size))] cursor-pointer items-center justify-center ease-in-out"
              style={{
                transition: 'transform 0.2s',
                transform:
                  row === 1 || row === 4 ?
                    'translateX(calc(var(--unit-size) * 2))'
                  : row === 2 ? 'translateX(calc(-1 * var(--unit-size) * 2))'
                  : 'translateX()', // mismatch 막기 위해 뭐라도 넣음
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                className="pointer-events-none h-[var(--unit-size)] w-[var(--unit-size)] will-change-transform"
              >
                {x ?
                  <rect x="25%" width="50%" height="100%" fill="#EA751A" />
                : <circle cx="50%" cy="50%" r="40%" fill="#E75015" />}
              </svg>
            </div>
          );
        })}
      </div>
    </div>
  );
};

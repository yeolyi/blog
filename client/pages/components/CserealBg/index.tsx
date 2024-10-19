import { MouseEventHandler, useEffect, useRef } from 'react';

import cserealbg from '../../assets/bg.png';

import { randomInt, throttle } from 'es-toolkit';
import {
  getCoord,
  setScale,
  strToBinary,
} from '@/client/pages/components/CserealBg/utils';
import {
  COL,
  ROW_OFFSET,
  CENTER_SCALE,
  DURATION,
} from '@/client/pages/components/CserealBg/constants';

const ripple = throttle((idx: number, elementList: HTMLDivElement[]) => {
  const [m, n] = getCoord(idx);

  for (let i = 0; i < elementList.length; i++) {
    if (i === idx) continue;

    const [m2, n2] = getCoord(i);
    const dist = (m - m2) ** 2 + (n - n2) ** 2;

    const target2 = elementList[i];
    setScale(target2, CENTER_SCALE, dist * 20);
    setScale(target2, 1, dist * 20 + 200);
  }

  // 눌린 대상 처리
  const target = elementList[idx];
  setScale(target, 0.8);
  setScale(target, 1, DURATION);
}, 500);

export const CserealBg = ({ onClick }: { onClick: () => void }) => {
  const spanListRef = useRef<HTMLDivElement[] | null>(null);
  const lastRippleTimeRef = useRef(0);

  const getMouseOverHandler = (idx: number) => () => {
    if (spanListRef.current === null) return;
    lastRippleTimeRef.current = Date.now();
    ripple(idx, spanListRef.current);
  };

  useEffect(() => {
    const id = setInterval(() => {
      const spanList = spanListRef.current;
      if (spanList === null) return;
      if (Date.now() - lastRippleTimeRef.current < 5000) return;

      const idx = randomInt(spanList.length);
      ripple(idx, spanList);
    }, 4000);

    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative h-full w-full">
      <img
        src={cserealbg}
        className="absolute bottom-0 left-0 right-0 top-0 h-full w-full cursor-pointer object-cover"
        onClick={onClick}
      />
      <div
        className="relative mx-auto grid w-fit select-none pt-[120px] sm:pt-[90px] md:pt-[60px]"
        style={{ gridTemplateColumns: `repeat(${COL}, minmax(0, 1fr))` }}
        ref={(element) => {
          if (element) {
            spanListRef.current = [...element.children] as HTMLDivElement[];
          }
        }}
      >
        {strToBinary('SNUCSE').map((x, idx) => {
          const row = Math.floor(idx / COL);
          const left = `calc(var(--unit-size) * 2 * ${ROW_OFFSET[row]})`;

          return (
            <Dot
              value={x}
              key={idx}
              onClick={getMouseOverHandler(idx)}
              left={left}
            />
          );
        })}
      </div>
    </div>
  );
};

const Dot = ({
  value,
  onClick,
  left,
}: {
  value: boolean;
  onClick: MouseEventHandler<HTMLDivElement>;
  left: string;
}) => {
  return (
    <div
      onClick={onClick}
      className="relative h-[calc(2*var(--unit-size))] w-[calc(2*var(--unit-size))] cursor-pointer duration-200 ease-in-out will-change-transform"
      style={{ left, transitionProperty: 'transform' }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        className="pointer-events-none h-full w-full ease-in-out"
        suppressHydrationWarning
      >
        {value ?
          <rect x="37.5%" y="25%" width="25%" height="50%" fill="#EA751A" />
        : <circle cx="50%" cy="50%" r="20%" fill="#E75015" />}
      </svg>
    </div>
  );
};

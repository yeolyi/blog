'use client';

import { ReactNode, useEffect, useMemo, useState } from 'react';
import GalleryControl from './Control';

export const Gallery = ({
  wide = false,
  children,
}: {
  wide?: boolean;
  children: ReactNode;
}) => {
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const [disabledDir, setDisabledDir] = useState<'none' | 'prev' | 'next'>(
    'prev',
  );

  let unit = useMemo(() => {
    if (container === null) return null;
    return parseInt(
      getComputedStyle(container).getPropertyValue(
        wide ? '--wide-tile-width' : '--tile-width',
      ),
    );
  }, [container, wide]);

  let scroll = (mode: 'prev' | 'next') => {
    if (container === null || unit === null) return;
    container.scrollBy({
      left: mode === 'prev' ? -unit : unit,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    if (container === null) return;

    const f = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.scrollLeft <= 200) setDisabledDir('prev');
      else if (
        target.scrollWidth - (target.scrollLeft + target.clientWidth) <=
        200
      )
        setDisabledDir('next');
      else setDisabledDir('none');
    };

    container.addEventListener('scroll', f);
    return () => container.removeEventListener('scroll', f);
  }, [container]);

  return (
    <div
      className={`pb-[118px] sm:pb-[124px] md:pb-[134px] lg:pb-[150px] ${wide ? 'wide' : ''}`}
    >
      <div
        className="no-scrollbar snap-x snap-mandatory scroll-p-[calc(50%-var(--viewport-content)/2)] overflow-scroll"
        ref={setContainer}
      >
        <ul
          className="mb-[10px] inline-grid w-fit grid-flow-col gap-[20px] px-[calc(50%-var(--viewport-content)/2)] sm:mb-[16px] md:mb-[18px] md:mr-[40px] lg:mb-[22px]"
          style={{
            gridTemplateRows: wide
              ? 'var(--wide-tile-height)'
              : 'var(--tile-height)',
          }}
        >
          {children}
        </ul>
      </div>

      <GalleryControl
        prev={() => scroll('prev')}
        next={() => scroll('next')}
        prevDisabled={disabledDir === 'prev'}
        nextDisabled={disabledDir === 'next'}
      />
    </div>
  );
};

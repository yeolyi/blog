import { ReactNode, useEffect, useMemo, useState } from 'react';

import { FaChevronRight } from 'react-icons/fa6';
import { Link } from 'react-router-dom';

// TODO: 스크롤 로직 리팩터링
const Project = ({ children }: { children: ReactNode }) => {
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const [disabledDir, setDisabledDir] = useState<'none' | 'prev' | 'next'>(
    'prev',
  );

  const unit = useMemo(() => {
    if (container === null) return null;
    return parseInt(
      getComputedStyle(container).getPropertyValue('--wide-tile-width'),
    );
  }, [container]);

  const scroll = (mode: 'prev' | 'next') => {
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
      className={`wide pb-[118px] sm:pb-[124px] md:pb-[134px] lg:pb-[150px]`}
    >
      <div
        className="no-scrollbar snap-x snap-mandatory scroll-p-[calc(50%-var(--viewport-content)/2)] overflow-scroll"
        ref={setContainer}
      >
        <ul
          className="mb-[10px] inline-grid w-fit grid-flow-col gap-[20px] px-[calc(50%-var(--viewport-content)/2)] sm:mb-[16px] md:mb-[18px] md:mr-[40px] lg:mb-[22px]"
          style={{
            gridTemplateRows: 'var(--wide-tile-height)',
          }}
        >
          {children}
        </ul>
      </div>

      <Control
        prev={() => scroll('prev')}
        next={() => scroll('next')}
        prevDisabled={disabledDir === 'prev'}
        nextDisabled={disabledDir === 'next'}
      />
    </div>
  );
};

type TileProps = {
  name: string;
  copy: string;
  href: string;
  bg: ReactNode;
};

const Cell = ({ name, copy, href, bg }: TileProps) => (
  <li className="relative flex w-[var(--wide-tile-width)] snap-start flex-col items-center justify-end overflow-hidden rounded-[28px] px-[20px] py-[60px] lg:px-[40px]">
    <div className="absolute bottom-0 left-0 right-0 top-0">{bg}</div>
    <div className="relative z-10 flex flex-col items-center">
      <h2 className="text-center text-[32px] font-semibold leading-[1.21875] tracking-[0] text-[rgb(245,245,247)] sm:text-[40px] sm:leading-[1.2] md:text-[48px] md:leading-[1.1875] lg:text-[64px] lg:leading-[1.171875]">
        {name}
      </h2>
      <p className="mt-[10px] max-w-[265px] text-center text-[14px] font-normal leading-[1.43] tracking-[0em] text-[rgb(245,245,247)] sm:max-w-[375px] md:max-w-full md:whitespace-pre lg:text-[17px]">
        {copy}
      </p>
      <Link
        to={href}
        className="mt-[20px] flex items-center gap-[2px] text-[14px] font-normal leading-[1.28] tracking-[0] text-white hover:underline"
      >
        보러가기
        <FaChevronRight className="h-[10px] w-[10px]" />
      </Link>
    </div>
  </li>
);

const Control = ({
  prev,
  prevDisabled,
  next,
  nextDisabled,
}: {
  prev: () => void;
  prevDisabled: boolean;
  next: () => void;
  nextDisabled: boolean;
}) => {
  return (
    <div className="relative">
      <div className="absolute right-[calc(50%-var(--viewport-content)/2)] top-[18px] mr-[var(--apps-margin-inline-end)] flex gap-[18px]">
        <button
          onClick={prev}
          className="rotate-180"
          style={{ opacity: prevDisabled ? 0.42 : 1 }}
          disabled={prevDisabled}
        >
          <CircleChevron />
        </button>
        <button
          onClick={next}
          style={{ opacity: nextDisabled ? 0.42 : 1 }}
          disabled={nextDisabled}
        >
          <CircleChevron />
        </button>
      </div>
    </div>
  );
};

const CircleChevron = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 36 36"
    className="h-[36px] w-[36px] rounded-full bg-[rgb(210,210,215)] fill-[rgba(0,0,0,0.56)] hover:bg-[rgba(0,0,0,0.16)] hover:fill-[rgba(0,0,0,0.64)]"
    style={{ transition: 'fill 100ms linear' }}
  >
    <path d="M23.5587,16.916 C24.1447,17.4999987 24.1467,18.446 23.5647,19.034 L16.6077,26.056 C16.3147,26.352 15.9287,26.4999987 15.5427,26.4999987 C15.1607,26.4999987 14.7787,26.355 14.4867,26.065 C13.8977,25.482 13.8947,24.533 14.4777,23.944 L20.3818,17.984 L14.4408,12.062 C13.8548,11.478 13.8528,10.5279 14.4378,9.941 C15.0218,9.354 15.9738,9.353 16.5588,9.938 L23.5588,16.916 L23.5587,16.916 Z"></path>
  </svg>
);

export default Object.assign(Project, { Cell });

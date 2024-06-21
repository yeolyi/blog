import JSSandbox from '@/components/code/JSSandbox';
import Link from 'next/link';
import { ReactNode, useRef } from 'react';
import { FaCircleChevronRight } from 'react-icons/fa6';
import { FaChevronRight } from 'react-icons/fa6';

import './gallery.css';

export const Gallery = ({
  wide = false,
  children,
}: {
  wide?: boolean;
  children: ReactNode;
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  let scroll = (mode: 'prev' | 'next') => {
    const container = containerRef.current;
    if (container === null) return;

    let left = parseInt(
      getComputedStyle(container).getPropertyValue(
        wide ? '--wide-tile-width' : '--tile-width',
      ),
    );

    if (mode === 'prev') left *= -1;

    container.scrollBy({ left, behavior: 'smooth' });
  };

  return (
    <div className={`gallery-container ${wide ? 'wide' : ''}`}>
      <div className="no-scrollbar gallery-scroll-container" ref={containerRef}>
        <ul className="gallery-grid">{children}</ul>
      </div>
      <GalleryControl prev={() => scroll('prev')} next={() => scroll('next')} />
    </div>
  );
};

export type TileProps = {
  name: string;
  description: string;
  concepts: string;
  href: string;
  code: string;
};

export const Tile = ({
  name,
  description,
  concepts,
  href,
  code,
}: TileProps) => (
  <li className="tile-container">
    <div className="tile-content">
      <h3 className="tile-title">{name}</h3>
      <p className="tile-description">{description}</p>
      <Link className="tile-link" href={href}>
        보러가기
      </Link>

      <div className="tile-sandbox-container">
        <JSSandbox code={code} disableEdit />
      </div>

      <div className="tile-footer">
        <h4>주요 개념</h4>
        <p>{concepts}</p>
      </div>
    </div>
  </li>
);

export type WideTileProps = {
  name: string;
  copy: string;
  href: string;
  bg: ReactNode;
};

export const WideTile = ({ name, copy, href, bg }: WideTileProps) => (
  <li className="wide-tile-container">
    <div className="wide-tile-bg-container">{bg}</div>
    <div className="wide-tile-content">
      <h2 className="wide-tile-title">{name}</h2>
      <p className="wide-tile-description">{copy}</p>
      <Link href={href} className="wide-tile-link">
        보러가기
        <FaChevronRight />
      </Link>
    </div>
  </li>
);

const GalleryControl = ({
  prev,
  next,
}: {
  prev: () => void;
  next: () => void;
}) => (
  <div className="relative">
    <div className="absolute right-[calc(50%-var(--viewport-content)/2)] top-[18px] mr-[var(--apps-margin-inline-end)] flex gap-[18px]">
      <button onClick={prev}>
        <FaCircleChevronRight className="h-[36px] w-[36px] rotate-180 fill-[rgb(210,210,215)]" />
      </button>
      <button onClick={next}>
        <FaCircleChevronRight className="h-[36px] w-[36px] fill-[rgb(210,210,215)]" />
      </button>
    </div>
  </div>
);

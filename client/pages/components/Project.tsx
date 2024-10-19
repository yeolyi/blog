import { useSquircle } from '@/client/pages/components/useSquircle';
import { LazyMotion, m } from 'framer-motion';
import { ReactNode, useState } from 'react';

import { FaChevronRight } from 'react-icons/fa6';

const Project = ({ children }: { children: ReactNode }) => {
  return (
    <ul
      className={`relative left-[calc(50%-var(--viewport-content)/2)] mb-[64px] mt-[32px] h-[var(--wide-tile-height)] w-[var(--wide-tile-width)] flex-wrap gap-[20px] md:mr-[40px] lg:mb-[80px]`}
    >
      {children}
    </ul>
  );
};

type TileProps = {
  name: string;
  copy: string;
  href: string;
  bg: ReactNode;
  index: number;
};

const loadFeatures = () =>
  import('../../util/lazyMotion.ts').then((res) => res.default);

const Cell = ({ name, copy, href, bg, index }: TileProps) => {
  const [container, setContainer] = useState<HTMLElement | null>(null);
  useSquircle(container, 28);

  return (
    <LazyMotion features={loadFeatures} strict>
      <m.li
        className={`absolute bottom-0 left-0 right-0 top-0 flex cursor-pointer flex-col items-center justify-end overflow-hidden rounded-[28px] px-[20px] py-[60px] lg:px-[40px]`}
        ref={setContainer}
        animate={{
          zIndex: 999 - index,
          translateY: `${index * -8}%`,
          scale: 1 - 0.08 * index,
          transition: {
            type: 'spring',
            stiffness: 400,
            damping: 30,
          },
        }}
        initial={false}
      >
        <div className="absolute bottom-0 left-0 right-0 top-0">{bg}</div>
        <div className="relative z-10 flex flex-col items-center">
          <h2 className="text-center text-[32px] font-semibold leading-[1.21875] tracking-[0] text-[rgb(245,245,247)] sm:text-[40px] sm:leading-[1.2] md:text-[48px] md:leading-[1.1875] lg:text-[64px] lg:leading-[1.171875]">
            {name}
          </h2>
          <p className="mt-[10px] max-w-[265px] text-center text-[14px] font-normal leading-[1.43] tracking-[0em] text-[rgb(245,245,247)] sm:max-w-[375px] md:max-w-full md:whitespace-pre lg:text-[17px]">
            {copy}
          </p>
          <a
            href={href}
            className="mt-[20px] flex items-center gap-[2px] text-[14px] font-normal leading-[1.28] tracking-[0] text-white hover:underline"
          >
            보러가기
            <FaChevronRight className="h-[10px] w-[10px]" />
          </a>
        </div>
      </m.li>
    </LazyMotion>
  );
};

export default Object.assign(Project, { Cell });

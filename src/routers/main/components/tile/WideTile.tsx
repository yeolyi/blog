import { ReactNode } from 'react';
import { FaChevronRight } from 'react-icons/fa6';
import { Link } from 'react-router-dom';

export type WideTileProps = {
  name: string;
  copy: string;
  href: string;
  bg: ReactNode;
};

export const WideTile = ({ name, copy, href, bg }: WideTileProps) => (
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

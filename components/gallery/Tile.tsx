import Link from 'next/link';
import { ReactNode } from 'react';
import { FaChevronRight } from 'react-icons/fa6';
import JSSandbox from '../code/JSSandbox';

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
}: TileProps) => {
  return (
    <li className="relative flex w-[var(--tile-width)] snap-start overflow-clip">
      <div
        className="z-10 flex w-full flex-col items-start gap-[10px] rounded-[28px] p-[20px] pr-[25px] pt-[25px] text-textblack md:p-[25px] md:pt-[30px]"
        style={{
          backgroundImage: `linear-gradient(
        163deg,
    hsl(51deg 97% 59%) 1%,
    hsl(50deg 93% 58%) 51%,
    hsl(49deg 90% 56%) 49%,
    hsl(48deg 86% 54%) 99%
  )`,
        }}
      >
        <h3 className="block text-[21px] font-semibold leading-[1.289] tracking-[0.011em] md:text-[24px] md:leading-[1.29] lg:text-[28px] lg:leading-[1.25]">
          {name}
        </h3>
        <p className="text-[14px] font-normal leading-[1.429] tracking-[0.022em] lg:text-[17px] lg:leading-[1.235]">
          {description}
        </p>
        <Link
          className="flex cursor-pointer items-center text-[14px] font-normal hover:underline lg:text-[17px]"
          href={href}
        >
          보러가기 <FaChevronRight className="h-[10px] w-[10px]" />
        </Link>

        <div className="mb-auto mt-[20px] w-full">
          <JSSandbox code={code} hideRefresh />
        </div>

        <div className="text-[14px] font-normal leading-[1.429] tracking-[0em]">
          <h4 className="font-semibold">주요 개념</h4>
          <p>{concepts}</p>
        </div>
      </div>
    </li>
  );
};

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
        href={href}
        className="mt-[20px] flex items-center gap-[2px] text-[14px] font-normal leading-[1.28] tracking-[0] text-white hover:underline"
      >
        보러가기
        <FaChevronRight className="h-[10px] w-[10px]" />
      </Link>
    </div>
  </li>
);

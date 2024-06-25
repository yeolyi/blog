import Link from 'next/link';
import { ReactNode } from 'react';
import { FaChevronRight } from 'react-icons/fa6';
import JSSandbox from '../code/JSSandbox';

export type TileProps = {
  name: string;
  description: string;
  concepts?: string;
  href?: string;
  content?: string | ReactNode;
  background?: string;
};

export const Tile = ({
  name,
  description,
  concepts,
  href,
  content,
  background,
}: TileProps) => {
  return (
    <TileContainer>
      <div
        className="z-10 flex w-full flex-col items-start gap-[10px] p-[20px] pr-[25px] pt-[25px] text-textblack md:p-[25px] md:pt-[30px]"
        style={{
          backgroundImage:
            background ??
            `linear-gradient(
        163deg,
    hsl(51deg 97% 59%) 1%,
    hsl(50deg 93% 58%) 51%,
    hsl(49deg 90% 56%) 49%,
    hsl(48deg 86% 54%) 99%
  )`,
        }}
      >
        <TileTitle>{name}</TileTitle>
        <p className="text-[14px] font-normal leading-[1.429] tracking-[0.022em] lg:text-[17px] lg:leading-[1.352]">
          {description}
        </p>
        {href !== undefined && (
          <Link
            className="flex cursor-pointer items-center text-[14px] font-normal hover:underline lg:text-[17px]"
            href={href}
          >
            보러가기 <FaChevronRight className="h-[10px] w-[10px]" />
          </Link>
        )}

        <div className="mb-auto mt-[20px] w-full">
          {typeof content === 'string' && (
            <JSSandbox code={content} hideRefresh expandedDefault />
          )}
          {typeof content !== 'string' && content}
        </div>

        {concepts !== undefined && (
          <div className="text-[14px] font-normal leading-[1.429] tracking-[0em]">
            <h4 className="font-semibold">배운 것들</h4>
            <p>{concepts}</p>
          </div>
        )}
      </div>
    </TileContainer>
  );
};

export const TileContainer = ({ children }: { children: ReactNode }) => (
  <li className="relative flex w-[var(--tile-width)] snap-start overflow-clip rounded-[28px]">
    {children}
  </li>
);

export const TileTitle = ({ children }: { children: ReactNode }) => (
  <h3 className="block text-[21px] font-semibold leading-[1.289] tracking-[0.011em] md:text-[24px] md:leading-[1.29] lg:text-[28px] lg:leading-[1.25]">
    {children}
  </h3>
);

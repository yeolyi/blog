import { MdxPage } from '@/client/types/page';
import { useImageColor } from '@/client/util/color';
import { ReactNode } from 'react';
import { Link } from 'react-router-dom';

const List = ({ children }: { children: ReactNode }) => (
  <ul className="horizontal-pad flex flex-wrap items-stretch gap-[20px] pb-[64px] lg:pb-[80px]">
    {children}
  </ul>
);

const Post = ({
  mdxPage: { path, src: imageSrc, title, dateStr },
}: {
  mdxPage: MdxPage;
}) => {
  const color = useImageColor(imageSrc);

  return (
    <li
      className="group relative mt-[9px] flex w-[var(--tile-width)] list-none flex-col overflow-hidden rounded-[16px] lg:mt-[13.5px]"
      style={{ backgroundColor: 'white' }}
    >
      <Link to={path} className="flex h-full w-full flex-col">
        <div className="z-10 flex grow flex-col justify-between p-[24px] lg:p-[32px]">
          <HighlightedTitle color={color}>{title}</HighlightedTitle>
          <div className="mt-[8px] text-[14px] font-semibold text-[#6e6e73] lg:mt-[12px]">
            {dateStr}
          </div>
        </div>
      </Link>
    </li>
  );
};

const HighlightedTitle = ({
  color,
  children,
}: {
  children: ReactNode;
  color?: string;
}) => {
  return (
    <h3
      className="w-fit pr-4 font-bold"
      style={{ fontSize: 'var(--tile-title)' }}
    >
      <span style={{ boxShadow: `inset 0 -5px 0 ${color + 'c0'}` }}>
        {children}
      </span>
    </h3>
  );
};

const JS = ({ title, description, path }: MdxPage) => {
  return (
    <li className="relative flex w-[var(--tile-width)] snap-start overflow-clip rounded-[28px] bg-lightgray">
      <p className="absolute -top-1/2 left-0 origin-top-left text-[600px] font-black leading-[100%] text-gray-200 opacity-40">
        {title[0]}
      </p>
      <a
        className={`z-10 flex w-full flex-col items-start gap-[10px] p-[20px] md:p-[25px]`}
        href={path}
      >
        <h3 className="font-semibold" style={{ fontSize: 'var(--tile-title)' }}>
          {title}
        </h3>
        <p className="text-[14px] font-normal leading-[1.429] tracking-[0.022em] lg:text-[17px] lg:leading-[1.352]">
          {description}
        </p>
      </a>
    </li>
  );
};

const WebAPI = ({ title, description, path }: MdxPage) => {
  return (
    <li className="relative flex w-[var(--tile-width)] snap-start overflow-clip rounded-[28px] bg-white">
      <a
        className={`z-10 flex w-full flex-col items-start gap-[10px] p-[20px] md:p-[25px]`}
        href={path}
      >
        <h3
          className="block font-semibold"
          style={{ fontSize: 'var(--tile-title)' }}
        >
          {title}
        </h3>
        <p className="text-[14px] font-normal leading-[1.429] tracking-[0.022em] lg:text-[17px] lg:leading-[1.352]">
          {description}
        </p>
      </a>
    </li>
  );
};

export default Object.assign(List, { Post, WebAPI, JS });

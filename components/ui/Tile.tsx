import { Link } from '@/i18n/navigation';
import type React from 'react';

type TileProps = {
  children: React.ReactNode;
  className?: string;
};

const Tile = ({ children, className = '' }: TileProps) => {
  return <div className={`flex gap-4 ${className}`}>{children}</div>;
};

type TileItemProps = {
  title: string;
  children: React.ReactNode;
  href: string;
  className?: string;
};

const TileItem = ({ title, children, href, className = '' }: TileItemProps) => {
  return (
    <Link
      href={href}
      className={`group border border-[#5e5e5e] hover:bg-white cursor-pointer relative ${className}`}
    >
      {children}
      <h3 className="absolute bottom-[10px] left-[10px] text-xl font-semibold">
        <span className="bg-black group-hover:text-black group-hover:bg-white text-white">
          {title}
        </span>
      </h3>
    </Link>
  );
};

export default Object.assign(Tile, {
  Item: TileItem,
});

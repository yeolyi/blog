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
  size: '75%';
  className?: string;
};

const TileItem = ({ title, children, size, className = '' }: TileItemProps) => {
  return (
    <div
      className={`border border-[#5e5e5e] hover:bg-white cursor-pointer relative ${size === '75%' ? 'w-3/4 h-3/4' : ''} ${className}`}
    >
      {children}
      <h3 className="absolute bottom-[10px] left-[10px] bg-black text-xl font-semibold text-white group-hover:text-black group-hover:bg-white">
        {title}
      </h3>
    </div>
  );
};

export default Object.assign(Tile, {
  Item: TileItem,
});

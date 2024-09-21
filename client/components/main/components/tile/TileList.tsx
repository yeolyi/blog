import { ReactNode } from 'react';

export const TileList = ({ children }: { children: ReactNode }) => {
  return (
    <div className={`pb-[118px] sm:pb-[124px] md:pb-[134px] lg:pb-[150px]`}>
      <ul
        className="mb-[10px] flex w-fit flex-wrap gap-[20px] px-[calc(50%-var(--viewport-content)/2)] sm:mb-[16px] md:mb-[18px] md:mr-[40px] lg:mb-[22px]"
        style={{ gridTemplateRows: 'var(--tile-height)' }}
      >
        {children}
      </ul>
    </div>
  );
};

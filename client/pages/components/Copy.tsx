import { ReactNode } from 'react';

export const Copy = ({ children }: { children: ReactNode }) => (
  <p className="mt-[10px] w-auto max-w-[430px] text-[19px] font-semibold leading-[1.32] tracking-[0.012em] text-textblack min-[590px]:max-w-[535px] lg:w-[390px] lg:text-[21px]">
    {children}
  </p>
);

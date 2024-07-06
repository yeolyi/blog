import Link from 'next/link';
import { ReactNode } from 'react';

type BadgeProps = {
  icon: ReactNode;
  title: string;
  cnt: number;
  href: string;
  className?: string;
};

export let Badge = ({ icon, title, cnt, href, className }: BadgeProps) => {
  return (
    <div
      className={`flex items-center overflow-hidden whitespace-nowrap rounded-[.25em] border border-solid border-[#d0d7de] ${className}`}
    >
      <Link
        href={href}
        className="flex items-center gap-[2px] bg-[#ebf0f4] px-[10px] py-[5px] text-[12px] font-semibold text-[#24292f]"
      >
        {icon}
        {title}
      </Link>
      <Link
        href={href}
        className="bg-white px-[10px] py-[5px] text-[12px] font-semibold text-[#24292f]"
      >
        {addCommas(cnt)}
      </Link>
    </div>
  );
};

let addCommas = (n: number) => {
  return String(n).replace(/(\d)(?=(\d{3})+$)/g, '$1,');
};

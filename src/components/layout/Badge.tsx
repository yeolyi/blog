import { ReactNode } from 'react';
import { Link } from 'react-router-dom';

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
        to={href}
        className="flex items-center gap-[2px] bg-[#ebf0f4] px-[10px] py-[5px] text-[12px] font-semibold text-[#24292f]"
      >
        {icon}
        {title}
      </Link>
      <Link
        to={href}
        className="bg-white px-[10px] py-[5px] text-[12px] font-semibold text-[#24292f]"
      >
        {cnt.toLocaleString()}
      </Link>
    </div>
  );
};

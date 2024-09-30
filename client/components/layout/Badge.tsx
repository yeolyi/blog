import { ReactNode, useEffect, useState } from 'react';
import { FaInstagram } from 'react-icons/fa6';
import { Link } from 'react-router-dom';

type BadgeProps = {
  icon: ReactNode;
  title: string;
  cnt: number;
  href: string;
};

export const Follower = () => {
  const cnt = useNumber('/instagram-follower');
  const href = 'https://instagram.com/yeolyii';

  return (
    <Badge
      title="Follower"
      icon={<FaInstagram className="text-[16px]" />}
      cnt={cnt}
      href={href}
    />
  );
};

export const Star = () => {
  const cnt = useNumber('/stargazer');
  const href = 'https://github.com/yeolyi/blog';
  return <Badge title="Star" icon={<StarSVG />} cnt={cnt} href={href} />;
};

const StarSVG = () => (
  <svg
    viewBox="0 0 16 16"
    width="16"
    height="16"
    className="octicon octicon-star"
    aria-hidden="true"
  >
    <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Zm0 2.445L6.615 5.5a.75.75 0 0 1-.564.41l-3.097.45 2.24 2.184a.75.75 0 0 1 .216.664l-.528 3.084 2.769-1.456a.75.75 0 0 1 .698 0l2.77 1.456-.53-3.084a.75.75 0 0 1 .216-.664l2.24-2.183-3.096-.45a.75.75 0 0 1-.564-.41L8 2.694Z"></path>
  </svg>
);

const Badge = ({ icon, title, cnt, href }: BadgeProps) => {
  return (
    <Link
      className="flex items-center overflow-hidden whitespace-nowrap rounded-[.25em] border border-solid border-[#d0d7de] dark:border-stone-700"
      to={href}
    >
      <span className="flex items-center gap-[4px] bg-[#ebf0f4] px-[10px] py-[5px] text-[12px] font-semibold text-[#24292f] dark:bg-stone-700 dark:fill-white dark:font-medium dark:text-white">
        {icon}
        {title}
      </span>
      <span className="bg-white px-[10px] py-[5px] text-[12px] font-semibold text-[#24292f] dark:bg-black dark:font-medium dark:text-white">
        {cnt.toLocaleString()}
      </span>
    </Link>
  );
};

const useNumber = (url: string) => {
  const [val, setVal] = useState(-1);

  useEffect(() => {
    (async () => {
      try {
        const resp = await fetch(url);
        const cnt = await resp.text();
        const val = parseInt(cnt);
        if (Number.isNaN(val)) return;
        setVal(val);
      } catch {
        // TODO
      }
    })();
  }, []);

  return val;
};

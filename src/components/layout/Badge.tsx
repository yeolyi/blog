import { ReactNode, useEffect, useState } from 'react';
import { FaInstagram } from 'react-icons/fa6';
import { Link } from 'react-router-dom';

type BadgeProps = {
  icon: ReactNode;
  title: string;
  cnt: number;
  href: string;
  className?: string;
};

export let Follower = ({ className }: { className?: string }) => {
  let cnt = useNumber('/instagram-follower');
  let href = 'https://instagram.com/yeolyii';

  return (
    <Badge
      title="follower"
      icon={<FaInstagram className="text-[16px]" />}
      cnt={cnt}
      href={href}
      className={className}
    />
  );
};

export let Star = () => {
  let cnt = useNumber('/stargazer');
  let href = 'https://github.com/yeolyi/blog';
  return <Badge title="star" icon={<StarSVG />} cnt={cnt} href={href} />;
};

let StarSVG = () => (
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

let Badge = ({ icon, title, cnt, href, className }: BadgeProps) => {
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

let useNumber = (url: string) => {
  let [val, setVal] = useState(-1);

  useEffect(() => {
    (async () => {
      try {
        let resp = await fetch(url);
        let cnt = await resp.text();
        setVal(parseInt(cnt));
      } catch {
        // TODO
      }
    })();
  }, []);

  return val;
};

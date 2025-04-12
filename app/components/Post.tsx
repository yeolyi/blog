import type React from 'react';
import Link from 'next/link';

type PostListProps = {
  children: React.ReactNode;
  className?: string;
};

const PostList = ({ children, className = '' }: PostListProps) => {
  return <ul className={`list-none p-0 ${className}`}>{children}</ul>;
};

type PostItemProps = {
  href: string;
  date: string;
  title: string;
  className?: string;
};

const PostItem = ({ href, date, title, className = '' }: PostItemProps) => {
  return (
    <li
      className={`group cursor-pointer hover:bg-white text-xl font-semibold py-2 ${className}`}
    >
      <Link href={href} className="flex w-full gap-2 no-underline">
        <span className="text-xl font-semibold text-white group-hover:text-black">
          {title}
        </span>
        <span className="text-xl text-[#666]">{date}</span>
      </Link>
    </li>
  );
};

export default Object.assign(PostList, {
  Item: PostItem,
});

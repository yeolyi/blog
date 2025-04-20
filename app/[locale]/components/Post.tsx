import { getPostIds } from '@/utils/post';
import { getLocale } from 'next-intl/server';
import Link from 'next/link';
import type React from 'react';

export default async function PostList() {
  const locale = await getLocale();
  const ids = await getPostIds(locale);
  const metadataList = await Promise.all(
    ids.map(async (id) => {
      const { title, date } = await import(`@/mdx/${id}/${locale}.mdx`);
      return { id, title, date };
    }),
  );
  const sortedMetadataList = metadataList.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return (
    <ul className="list-none p-0">
      {sortedMetadataList.map(({ id, title, date }) => (
        <PostItem key={id} href={`/post/${id}`} date={date} title={title} />
      ))}
    </ul>
  );
}

type PostItemProps = {
  href: string;
  date: string;
  title: string;
  className?: string;
};

const PostItem = ({ href, date, title, className = '' }: PostItemProps) => {
  return (
    <li
      className={`group cursor-pointer hover:bg-white active:bg-white text-xl font-semibold py-2 ${className}`}
    >
      <Link href={href} className="flex flex-wrap w-full no-underline">
        <span className="text-xl font-semibold text-white group-hover:text-black group-active:text-black mr-2 break-keep">
          {title}
        </span>
        <span className="text-xl text-[#666]">{date}</span>
      </Link>
    </li>
  );
};

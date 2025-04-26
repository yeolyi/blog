import { Link } from '@/i18n/navigation';
import { getPostIds } from '@/utils/post';
import { getLocale } from 'next-intl/server';
import type React from 'react';

export default async function PostList() {
  const locale = await getLocale();
  const ids = await getPostIds(locale);
  const metadataList = await Promise.all(
    ids.map(async (id) => {
      const { default: _, ...metadata } = await import(
        `@/mdx/${id}/${locale}.mdx`
      );
      return { id, ...metadata };
    }),
  );
  const sortedMetadataList = metadataList.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return (
    <ul className="list-none p-0">
      {sortedMetadataList.map(({ id, title, date, description }) => (
        <li
          key={id}
          className="group cursor-pointer hover:bg-white active:bg-white text-xl font-semibold py-2"
        >
          <Link
            href={`/post/${id}`}
            className="flex flex-col w-full no-underline"
          >
            <div className="flex flex-wrap">
              <span className="text-xl font-semibold text-white group-hover:text-black group-active:text-black mr-2 break-keep">
                {title}
              </span>
              <span className="text-xl text-[#666]">{date}</span>
            </div>
            {description && (
              <span className="text-xl text-[#999] group-hover:text-[#666] group-active:text-[#666]">
                {description}
              </span>
            )}
          </Link>
        </li>
      ))}
    </ul>
  );
}

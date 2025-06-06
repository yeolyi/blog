import { skewOnHover } from '@/components/ui/theme';
import { Link } from '@/i18n/navigation';
import { getPostIds } from '@/utils/path';
import clsx from 'clsx';
import { getLocale } from 'next-intl/server';

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
    <ul>
      {sortedMetadataList.map(({ id, title, date }) => (
        <li key={id} className="group">
          <Link
            href={`/post/${id}`}
            className="flex w-full no-underline text-base flex-col sm:flex-row py-2"
          >
            <span
              className={clsx(
                'text-stone-500 shrink-0 font-normal mr-2',
                skewOnHover,
              )}
            >
              {date}
            </span>
            <h3
              className={clsx('text-white font-semibold shrink-0', skewOnHover)}
            >
              {title}
            </h3>
          </Link>
        </li>
      ))}
    </ul>
  );
}

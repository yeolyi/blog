import { Link } from '@/i18n/navigation';
import { getPostIds } from '@/utils/post';
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
        <li key={id} className="group hover:bg-white py-2">
          <Link
            href={`/post/${id}`}
            className="flex w-full no-underline text-base flex-wrap gap-2"
          >
            <span className="text-gray-500 shrink-0 font-normal">{date}</span>
            <h3 className="text-white group-hover:text-black font-semibold shrink-0">
              {title}
            </h3>
          </Link>
        </li>
      ))}
    </ul>
  );
}

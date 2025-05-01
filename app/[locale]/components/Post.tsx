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
      {sortedMetadataList.map(({ id, title, date, description }) => (
        <li key={id} className="group hover:bg-white">
          <Link
            href={`/post/${id}`}
            className="flex flex-col w-full no-underline"
          >
            <h3 className="text-white group-hover:text-black">{title}</h3>
            {description && (
              <p className="text-sm text-gray-300">{description}</p>
            )}
            <span className="text-sm text-gray-500">{date}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

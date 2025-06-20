import { skewOnHover } from '@/components/ui/theme';
import { Link } from '@/i18n/navigation';
import { getPostIds } from '@/utils/path';
import clsx from 'clsx';
import { getLocale } from 'next-intl/server';

export default async function PostList() {
  const locale = await getLocale();
  const ids = await getPostIds(locale);

  const arr: { href: string; title: string; date: string }[] =
    await Promise.all(
      ids.map(async (id) => {
        const { default: _, ...metadata } = await import(
          `@/mdx/${id}/${locale}.mdx`
        );
        return { href: `/post/${id}`, ...metadata };
      }),
    );

  if (locale === 'ko') {
    arr.push({
      href: '/react/setup',
      title: '리액트 소스코드 직접 수정해서 써보기',
      date: '2025-05-23',
    });
    arr.push({
      href: '/cs/zero-and-one',
      title: '컴퓨터의 손가락이 두 개인 이유',
      date: '2025-05-04',
    });
  }

  const sortedArr = arr.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return (
    <ul>
      {sortedArr.map(({ href, title, date }) => (
        <Item key={href} href={href} title={title} date={date} />
      ))}
    </ul>
  );
}

const Item = ({
  href,
  title,
  date,
}: {
  href: string;
  title: string;
  date: string;
}) => (
  <li className="group">
    <Link
      href={href}
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
      <h3 className={clsx('text-white font-semibold shrink-0', skewOnHover)}>
        {title}
      </h3>
    </Link>
  </li>
);

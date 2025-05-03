import type { PostType } from '@/app/[locale]/page';
import { Link } from '@/i18n/navigation';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';

export default function CurriculumPost(post: PostType) {
  const t = useTranslations('Curriculum');

  if (post.isPublished) {
    return (
      <li
        className={clsx(
          'list-decimal text-gray-400 list-inside group cursor-pointer hover:border-l-2 hover:border-white hover:pl-2',
        )}
      >
        <Link
          href={post.slug}
          className="font-semibold inline text-base text-pretty break-keep text-white"
        >
          {post.title}
        </Link>
        {post.description && (
          <p className="text-white text-base">{post.description}</p>
        )}
      </li>
    );
  }
  return (
    <li className="list-decimal text-gray-500 list-inside">
      <h4 className="font-semibold inline text-base text-pretty break-keep">
        {post.title}
        <span className="bg-gray-700 ml-2 px-1 text-xs text-white">
          {t('comingSoon')}
        </span>
      </h4>
      {post.description && <p className="text-base">{post.description}</p>}
    </li>
  );
}

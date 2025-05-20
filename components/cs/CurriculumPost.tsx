import type { PostType } from '@/app/[locale]/page';
import { Link } from '@/i18n/navigation';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';

export default function CurriculumPost(post: PostType) {
  const t = useTranslations('Curriculum');

  if (post.isPublished) {
    return (
      <Link href={post.slug} className="group block">
        <li
          className={clsx(
            'list-decimal text-gray-400 list-inside cursor-pointer',
          )}
        >
          <h3 className="font-semibold inline text-base text-pretty break-keep text-white group-hover:text-white/80">
            {post.title}
          </h3>
          {post.description && (
            <p className="text-white text-base group-hover:text-white/80">
              {post.description}
            </p>
          )}
        </li>
      </Link>
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

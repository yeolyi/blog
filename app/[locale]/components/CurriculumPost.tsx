import type { PostType } from '@/app/[locale]/data/curriculumData';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

export default function CurriculumPost(post: PostType) {
  const t = useTranslations('Curriculum');

  return (
    <li className="list-decimal text-gray-400 list-inside">
      {post.isPublished ? (
        <Link href={post.slug}>{post.title}</Link>
      ) : (
        <h4 className="font-medium inline text-base text-pretty break-keep text-gray-400">
          {post.title}
          <span className="bg-gray-700 ml-2 px-1 text-xs text-white">
            {t('comingSoon')}
          </span>
        </h4>
      )}
      {post.description && (
        <p
          className={`${post.isPublished ? 'text-gray-200' : 'text-gray-400'} text-base`}
        >
          {post.description}
        </p>
      )}
    </li>
  );
}

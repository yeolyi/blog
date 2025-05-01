import type { PostType } from '@/app/[locale]/data/curriculumData';
import Link from 'next/link';

export default function CurriculumPost(postType: PostType) {
  const { title, description, isPublished } = postType;

  return (
    <li>
      {isPublished ? (
        <Link href={postType.slug}>{title}</Link>
      ) : (
        <h4 className="font-medium text-gray-400">
          {title}{' '}
          <span className="ml-2 bg-gray-700 px-2 py-0.5 rounded text-sm">
            게시 예정
          </span>
        </h4>
      )}
      {description && (
        <p className={`${isPublished ? 'text-gray-300' : 'text-gray-400'}`}>
          {description}
        </p>
      )}
    </li>
  );
}

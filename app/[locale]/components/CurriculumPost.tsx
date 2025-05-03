import type { PostType } from '@/app/[locale]/data/curriculumData';
import Link from 'next/link';

export default function CurriculumPost(postType: PostType) {
  const { title, description, isPublished } = postType;

  return (
    <li className="list-decimal text-gray-400 list-inside">
      {isPublished ? (
        <Link href={postType.slug}>{title}</Link>
      ) : (
        <h4 className="font-medium inline text-xl text-pretty break-keep text-white">
          {title}
          <span className="bg-gray-700 ml-2 px-1 text-sm text-white">
            준비중
          </span>
        </h4>
      )}
      {description && (
        <p
          className={`${isPublished ? 'text-gray-200' : 'text-gray-400'} text-base`}
        >
          {description}
        </p>
      )}
    </li>
  );
}

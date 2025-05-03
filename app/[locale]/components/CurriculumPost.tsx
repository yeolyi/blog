import type { PostType } from '@/app/[locale]/data/curriculumData';
import Link from 'next/link';

export default function CurriculumPost(postType: PostType) {
  const { title, description, isPublished } = postType;

  return (
    <li className="mb-4 list-decimal">
      {isPublished ? (
        <Link href={postType.slug}>{title}</Link>
      ) : (
        <h4 className="font-medium text-gray-400">{title}</h4>
      )}
      {description && (
        <p
          className={`${isPublished ? 'text-gray-200' : 'text-gray-400'} text-sm`}
        >
          {description}
        </p>
      )}
    </li>
  );
}

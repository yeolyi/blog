import Link from 'next/link';

type CurriculumPostProps = {
  title: string;
  description: string;
  isPublished: boolean;
  slug?: string;
};

export default function CurriculumPost({
  title,
  description,
  isPublished,
  slug,
}: CurriculumPostProps) {
  return (
    <li>
      {isPublished && slug ? (
        <Link href={slug} className="text-blue-400 hover:underline">
          <div className="font-medium">{title}</div>
        </Link>
      ) : (
        <div className="font-medium text-gray-400">
          {title}{' '}
          <span className="text-xs ml-2 bg-gray-700 px-2 py-0.5 rounded">
            게시 예정
          </span>
        </div>
      )}
      <p
        className={`text-sm ${isPublished ? 'text-gray-300' : 'text-gray-400'} mt-1`}
      >
        {description}
      </p>
    </li>
  );
}

import type { PartType } from '@/app/[locale]/data/curriculumData';
import Image from 'next/image';
import CurriculumPost from './CurriculumPost';

export default function CurriculumSection({ title, image, posts }: PartType) {
  return (
    <>
      <div className="relative prose-h3:m-0">
        {image ? (
          <>
            <Image src={image} alt={title} className="w-[75%] max-w-[384px]" />
            <h3 className="absolute bottom-2 left-2 text-white bg-black ">
              {title}
            </h3>
          </>
        ) : (
          <h3>{title}</h3>
        )}
      </div>
      <ul>
        {posts.map((post) => (
          <CurriculumPost key={post.title} {...post} />
        ))}
      </ul>
    </>
  );
}

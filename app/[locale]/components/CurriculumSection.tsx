import type { PartType } from '@/app/[locale]/data/curriculumData';
import Image from 'next/image';
import CurriculumPost from './CurriculumPost';

export default function CurriculumSection({ title, image, posts }: PartType) {
  return (
    <>
      <h3>{title}</h3>
      {image && (
        <Image src={image} alt={title} className="w-full max-w-[384px]" />
      )}
      <ul>
        {posts.map((post) => (
          <CurriculumPost key={post.id} {...post} />
        ))}
      </ul>
    </>
  );
}

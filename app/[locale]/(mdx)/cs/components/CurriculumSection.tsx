import type { PartType } from '@/app/[locale]/page';
import Image from 'next/image';
import CurriculumPost from './CurriculumPost';

export default function CurriculumSection({ title, image, posts }: PartType) {
  return (
    <div>
      {image ? (
        <div className="relative max-w-[384px]">
          <Image src={image} alt={title || ''} className="w-[100%] mb-8" />
          <h3 className="absolute bottom-2 left-2 text-white font-semibold text-xl pr-4 right-0 mr-2">
            <span className="bg-black">{title}</span>
          </h3>
        </div>
      ) : (
        <h3 className="text-white font-semibold text-xl mb-8">{title}</h3>
      )}
      <ul className="mb-16 space-y-4">
        {posts.map((post) => (
          <CurriculumPost key={post.titleKey} {...post} />
        ))}
      </ul>
    </div>
  );
}

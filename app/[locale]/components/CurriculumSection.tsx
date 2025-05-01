import type { PartType } from '@/app/[locale]/data/curriculumData';
import CurriculumPost from './CurriculumPost';

export default function CurriculumSection({ title, image, posts }: PartType) {
  return (
    <>
      <h3>{title}</h3>
      <ul>
        {posts.map((post) => (
          <CurriculumPost key={post.id} {...post} />
        ))}
      </ul>
    </>
  );
}

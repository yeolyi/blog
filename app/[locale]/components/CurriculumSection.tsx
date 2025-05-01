import type { PostType } from '../data/curriculumData';
import CurriculumPost from './CurriculumPost';

type CurriculumSectionProps = {
  title: string;
  posts: PostType[];
};

export default function CurriculumSection({
  title,
  posts,
}: CurriculumSectionProps) {
  return (
    <div className="mb-8">
      <h4 className="text-white text-lg font-medium mb-2">{title}</h4>
      <ul className="space-y-4">
        {posts.map((post) => (
          <CurriculumPost
            key={post.id}
            title={post.title}
            description={post.description}
            isPublished={post.isPublished}
            slug={post.slug}
          />
        ))}
      </ul>
    </div>
  );
}

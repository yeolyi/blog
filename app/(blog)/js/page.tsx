import PostLayout from '@/components/layout/PostLayout';
import Markdown from '@/markdown/js.mdx';

export const metadata = {
  title: '자바스크립트',
  description: '공부하며 재밌고 얼척없던 것들을 기록해요',
};

export default function Page() {
  return (
    <PostLayout>
      <Markdown />
    </PostLayout>
  );
}

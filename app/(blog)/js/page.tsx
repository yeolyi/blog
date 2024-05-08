import PostLayout from '@/components/layout/PostLayout';
import Markdown from '@/markdown/js.mdx';

export const metadata = {
  title: '자바스크립트',
  description: '기록할만한 자바스크립트 내용을 코드와 함께 남겨요',
};

export default function Page() {
  return (
    <PostLayout>
      <Markdown />
    </PostLayout>
  );
}

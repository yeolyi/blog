import PostLayout from '@/components/layout/PostLayout';
import JS0 from '@/markdown/js0.mdx';
import JS1 from '@/markdown/js1.mdx';
import JS2 from '@/markdown/js2.mdx';
import JS3 from '@/markdown/js3.mdx';
import { notFound } from 'next/navigation';

let id2Mdx = [JS0, JS1, JS2, JS3];

export const metadata = {
  title: '자바스크립트',
  description: '기록할만한 자바스크립트 내용을 코드와 함께 남겨요',
};

export default function Page({ params }: { params: { id: string } }) {
  let Mdx = id2Mdx[Number(params.id)];
  if (Mdx === undefined) notFound();

  return (
    <PostLayout>
      <Mdx />
    </PostLayout>
  );
}

import TableOfContents from '@/app/post/[id]/components/TableOfContents';
import { getPostIds } from '@/utils/post';
import Comments from './components/Comments';

export default async function PostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { default: Component, title } = await import(`@/mdx/${id}/page.mdx`);
  return (
    <>
      <h1>{title}</h1>
      <Component />
      <Comments postId={id} />
    </>
  );
}

export const dynamicParams = false;

export async function generateStaticParams() {
  const ids = await getPostIds();
  return ids.map((id) => ({ id }));
}

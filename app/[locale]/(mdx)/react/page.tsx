import Comments from '@/components/comment';
import TableOfContents from '@/components/layout/TableOfContents';

export default async function PostPage() {
  const { default: Component } = await import('@/mdx/react/index.mdx');

  return (
    <>
      <div className="prose prose-stone prose-invert mb-12">
        <Component />
      </div>

      <Comments postId="react" />

      <div className="fixed top-[15vh] left-[calc(50vw+24rem)] hidden xl:block">
        <TableOfContents />
      </div>
    </>
  );
}

export const dynamicParams = false;

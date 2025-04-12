import { getPostIds } from '@/utils/post';

export default async function PostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const {
    default: Component,
    title,
    date,
  } = await import(`@/mdx/${id}/page.mdx`);
  console.log(title, date);
  return <Component />;
}

export const dynamicParams = false;

export async function generateStaticParams() {
  const ids = await getPostIds();
  return ids.map((id) => ({ id }));
}

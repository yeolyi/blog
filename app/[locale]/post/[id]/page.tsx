import { routing } from '@/i18n/routing';
import { getPostIds } from '@/utils/post';

export default async function PostPage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const { id, locale } = await params;
  const { default: Component, title } = await import(
    `@/mdx/${id}/${locale}.mdx`
  );
  return (
    <>
      <h1>{title}</h1>
      <Component />
    </>
  );
}

export const dynamicParams = false;

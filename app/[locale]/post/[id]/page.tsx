import { routing } from '@/i18n/routing';
import { getPostIds } from '@/utils/post';
import type { Metadata, ResolvingMetadata } from 'next';
import { ROUTES_MANIFEST } from 'next/dist/shared/lib/constants';
import { notFound } from 'next/navigation';

type Props = {
  params: Promise<{ id: string; locale: string }>;
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { id, locale } = await params;

  // MDX 파일에서 title과 기타 메타데이터를 가져옵니다
  const { title, description } = await import(`@/mdx/${id}/${locale}.mdx`);

  return {
    title,
    description: description || (await parent).description,
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const { id, locale } = await params;

  try {
    const { default: Component, title } = await import(
      `@/mdx/${id}/${locale}.mdx`
    );
    return (
      <>
        <h1>{title}</h1>
        <Component />
      </>
    );
  } catch (error) {
    notFound();
  }
}

export const generateStaticParams = async () => {
  const locales = routing.locales;
  return await Promise.all(
    locales.flatMap(async (locale) => {
      const postIds = await getPostIds(locale);
      return postIds.map((postId) => ({ id: postId, locale }));
    }),
  );
};

export const dynamicParams = false;

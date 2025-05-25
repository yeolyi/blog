import { generateCSMetadata } from '@/app/[locale]/(mdx)/cs/utils/generateCSMetadata';
import Comments from '@/components/comment';
import PostNavigation from '@/components/cs/PostNavigation';
import TableOfContents from '@/components/layout/TableOfContents';
import { routing } from '@/i18n/routing';
import { getPostIds } from '@/utils/path';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';
export const generateMetadata = generateCSMetadata;

export default async function PostPage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const { id, locale } = await params;

  try {
    const { default: Component, title } = await import(
      `@/mdx/cs/${id}/${locale}.mdx`
    );

    return (
      <>
        <div className="prose prose-stone prose-invert mb-12">
          <h1>{title}</h1>
          <Component />
        </div>

        <PostNavigation id={id} className="mb-12" />

        <Comments postId={id} />

        <div className="fixed top-[15vh] left-[calc(50vw+24rem)] hidden xl:block">
          <TableOfContents />
        </div>
      </>
    );
  } catch (error) {
    notFound();
  }
}

export const generateStaticParams = async () => {
  const locales = routing.locales;
  const result = [];

  for (const locale of locales) {
    const postIds = await getPostIds(locale, 'cs');
    for (const postId of postIds) {
      result.push({ id: postId, locale });
    }
  }

  return result;
};

export const dynamicParams = false;

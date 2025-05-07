import Comments from '@/app/[locale]/(mdx)/post/[id]/components/Comment';
import TableOfContents from '@/app/[locale]/(mdx)/post/[id]/components/TableOfContents';
import { routing } from '@/i18n/routing';
import { getPostIds } from '@/utils/post';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{ id: string; locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id, locale } = await params;
  const { title, description, ogImage } = await import(
    `@/mdx/cs/${id}/${locale}.mdx`
  );
  const vercelURL = process.env.VERCEL_PROJECT_PRODUCTION_URL;

  return {
    metadataBase:
      process.env.NODE_ENV === 'development'
        ? new URL('http://localhost:3000')
        : new URL(vercelURL ? `https://${vercelURL}` : 'https://yeolyi.com'),
    title,
    description,
    openGraph: {
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
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
      `@/mdx/cs/${id}/${locale}.mdx`
    );

    return (
      <>
        <div className="prose prose-invert mb-12">
          <h1>{title}</h1>
          <Component />
        </div>
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

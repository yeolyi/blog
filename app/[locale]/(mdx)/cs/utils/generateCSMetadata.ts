import type { Metadata } from 'next';

type Props = {
  params: Promise<{ id: string; locale: string }>;
};

export async function generateCSMetadata({ params }: Props): Promise<Metadata> {
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

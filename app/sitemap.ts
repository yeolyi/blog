import { generateStaticParams as generateStaticCsParams } from '@/app/[locale]/(mdx)/cs/[id]/page';
import { generateStaticParams as generateStaticPostParams } from '@/app/[locale]/(mdx)/post/[id]/page';
import { routing } from '@/i18n/routing';
import type { MetadataRoute } from 'next';

const BASE_URL = `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const postStaticParams = await generateStaticPostParams();
  const csStaticParams = await generateStaticCsParams();
  const staticParams = [...postStaticParams, ...csStaticParams];

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${BASE_URL}/en`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${BASE_URL}/cs`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${BASE_URL}/en/cs`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    ...staticParams.map(({ id, locale }) => {
      const localeUrl = locale === routing.defaultLocale ? '' : `${locale}/`;
      return {
        url: `${BASE_URL}/${localeUrl}post/${id}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      };
    }),
  ];
}

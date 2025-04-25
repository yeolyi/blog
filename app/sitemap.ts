import { generateStaticParams as generateStaticPostParams } from '@/app/[locale]/post/[id]/page';
import { routing } from '@/i18n/routing';
import type { MetadataRoute } from 'next';

const BASE_URL = `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const postStaticParams = await generateStaticPostParams();

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    ...postStaticParams.map(({ id, locale }) => {
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

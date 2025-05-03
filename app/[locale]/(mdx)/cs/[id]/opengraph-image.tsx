import getOG from '@/app/[locale]/(mdx)/utils/getOG';

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const { id, locale } = await params;
  return getOG({ id, locale, subDir: 'cs' });
}

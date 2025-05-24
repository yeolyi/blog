import getOG, {
  alt,
  contentType,
  size,
} from '@/app/[locale]/(mdx)/utils/getOG';
export { alt, contentType, size };

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const { id, locale } = await params;
  return getOG({ id, locale });
}

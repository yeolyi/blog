import { Page } from '@/client/types/page';

export const PageMeta = ({ page }: { page: Page }) => {
  return (
    <>
      <title>{page.title}</title>
      <meta name="description" content={page.description} />
      <meta property="og:title" content={page.title} />
      <meta property="og:type" content="website" />
      <meta property="og:image" content={page.src} />
      <meta property="og:description" content={page.description} />
      <meta property="og:site_name" content="yeolyi.com" />
    </>
  );
};

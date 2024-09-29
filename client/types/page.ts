export type Page = {
  title: string;
  description: string;
  path: string;
  src?: string;
};

export type MdxPage = Page & {
  importMdx: () => Promise<typeof import('*.mdx')>;
  dateStr?: string;
  objectFit?: 'contain' | 'cover';
};

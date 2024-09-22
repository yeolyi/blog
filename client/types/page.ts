export type Page = {
  title: string;
  description: string;
  path: string;
  src?: string;
};

export type MdxPage = Page & {
  // TODO: any 처리
  importMdx: () => Promise<typeof import('*.mdx')>;
  dateStr?: string;
  objectFit?: 'contain' | 'cover';
};

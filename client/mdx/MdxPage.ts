export type MdxPage = {
  title: string;
  description: string;
  path: string;
  importMdx: () => Promise<typeof import('*.mdx')>;

  exampleCode?: string;
  dateStr?: string;
  imageSrc?: string;
};

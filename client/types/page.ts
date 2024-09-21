export type Page = {
  title: string;
  description: string;
  path: string;
  imageSrc?: string;
};

export type MdxPage = Page & {
  // TODO: any 처리
  importMdx: () => Promise<typeof import('*.mdx')>;
  exampleCode?: string;
  dateStr?: string;
};

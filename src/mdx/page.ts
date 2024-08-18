import { MDXProps } from 'mdx/types';
import { ReactNode } from 'react';

export type Page = {
  title: string;
  description: string;
  path: string;
  Mdx: React.LazyExoticComponent<(props: MDXProps) => ReactNode>;

  exampleCode?: string;
  dateStr?: string;
  imageSrc?: string;
};

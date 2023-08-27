import { TOC } from './extractTOC';

export interface PostCache {
  data: { title?: string; description?: string };
  content: string;
  toc: TOC;
}

export const cache: { [key: string]: PostCache } = {};

import { allMdxPosts } from '@/client/mdx';
import { Page } from '@/client/types/page';

export const mainPage: Page = {
  title: '개발자 성열',
  description: '유익하고 바보같고 화가나는 개발자 일상',
  path: '/',
};

export const pageList = [mainPage, ...allMdxPosts];

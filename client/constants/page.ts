import { allMdxPosts } from '@/client/mdx';
import { MdxPage, Page } from '@/client/types/page';

export const mainPage: Page = {
  title: '개발자 성열',
  description: '유익하고 바보같고 화가나는 개발자 일상',
  path: '/',
};

// TODO: 404 페이지 메타데이터 추가
export const notFoundPage: MdxPage = {
  ...mainPage,
  importMdx: () => import('../mdx/etc/notFound.mdx'),
};

export const pageList = [mainPage, ...allMdxPosts];

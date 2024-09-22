import lodash from './assets/lodash.svg';
import es2024 from './assets/es2024.png';
import eslint from './assets/eslint.svg';
import jslogo from './assets/jslogo.svg';
import eslintJS from './assets/eslintJS.svg';
import kakaoIntern from './assets/kakao_intern.png';
import blog from './assets/blog.png';
import { MdxPage } from '@/client/types/page';

export const postPageList: MdxPage[] = [
  {
    title: '2024 카카오 겨울 인턴십 전환 후기',
    description: '지원서부터 최종 면접까지 배운 것들을 공유합니다.',
    dateStr: '2024.09.11',
    path: '/post/kakao-intern',
    importMdx: () => import('./kakao-intern.mdx'),
    src: kakaoIntern,
    objectFit: 'cover',
  },
  {
    title: 'Next.js가 싫은 사람의 블로그 개발기',
    description:
      '어떤 목적으로 블로그를 직접 개발했는지를 설명하고 그 결과물을 소개합니다. 왜 Next.js가 싫었는지와 리액트로 SSR을 어떻게 구현했는지를 소개합니다.',
    dateStr: '2024.09.07',
    path: '/post/blog-ssr',
    importMdx: () => import('./blog-ssr.mdx'),
    src: blog,
    objectFit: 'contain',
  },
  {
    title: 'ESLint 규칙들 정독하며 배우는 JS',
    description:
      'ESLint에는 JS에서 실수하기 쉬운 부분을 잡아내기 위한 규칙들이 많습니다. ESLint 규칙들을 훑어보며 JS의 미묘한 부분들을 정리해보았습니다.',
    dateStr: '2024.08.31',
    path: '/post/eslint-rules',
    importMdx: () => import('./eslint-rules.mdx'),
    src: eslintJS,
    objectFit: 'contain',
  },
  {
    title: '가볍게 살펴보는 ESLint',
    description: '',
    dateStr: '2024.07.21',
    path: '/post/eslint',
    importMdx: () => import('./eslint.mdx'),
    src: eslint,
    objectFit: 'contain',
  },
  {
    title: '가볍게 살펴보는 Lodash',
    description: '',
    dateStr: '2024.07.20',
    path: '/post/lodash',
    importMdx: () => import('./lodash.mdx'),
    src: lodash,
    objectFit: 'contain',
  },
  {
    title: '책으로 공부할 땐 몰랐던 최신 JS 기능 공부',
    description: '',
    dateStr: '2024.07.19',
    path: '/post/es2024',
    importMdx: () => import('./es2024.mdx'),
    src: jslogo,
    objectFit: 'contain',
  },
  {
    title: '바벨 플러그인으로 미래의 JS 기능들 미리 써보기',
    description: '',
    dateStr: '2024.07.07',
    path: '/post/js-proposals',
    importMdx: () => import('./js-proposals.mdx'),
    src: es2024,
    objectFit: 'cover',
  },
];

import lodash from './assets/lodash.svg';
import es2024 from './assets/es2024.png';
import eslint from './assets/eslint.svg';
import jslogo from './assets/jslogo.svg';
import eslintJS from './assets/eslintJS.svg';
import blog from './assets/blog.png';
import { MdxPage } from '../MdxPage';

export let postPageList: MdxPage[] = [
  {
    title: 'Next.js는 싫은데 SSR은 쓰고 싶었던 블로그 개발기',
    description:
      '어떤 목적으로 블로그를 직접 개발했는지를 설명하고 그 결과물을 소개합니다. 왜 Next.js가 싫었는지와 리액트로 SSR을 어떻게 구현했는지를 소개합니다.',
    dateStr: '2024.08.31',
    path: '/post/blog-ssr',
    importMdx: () => import('./blog-ssr.mdx'),
    imageSrc: blog,
  },
  {
    title: 'ESLint로 배우는 JS',
    description:
      'ESLint에는 JS에서 실수하기 쉬운 부분을 잡아내기 위한 규칙들이 많습니다. ESLint 규칙들을 훑어보며 JS의 미묘한 부분들을 정리해보았습니다.',
    dateStr: '2024.08.31',
    path: '/post/eslint-rules',
    importMdx: () => import('./eslint-rules.mdx'),
    imageSrc: eslintJS,
  },
  {
    title: '가볍게 살펴보는 ESLint',
    description: '',
    dateStr: '2024.07.21',
    path: '/post/eslint',
    importMdx: () => import('./eslint.mdx'),
    imageSrc: eslint,
  },
  {
    title: '가볍게 살펴보는 Lodash',
    description: '',
    dateStr: '2024.07.20',
    path: '/post/lodash',
    importMdx: () => import('./lodash.mdx'),
    imageSrc: lodash,
  },
  {
    title: '책에는 없는 JS 기능 구경',
    description: '',
    dateStr: '2024.07.19',
    path: '/post/es2024',
    importMdx: () => import('./es2024.mdx'),
    imageSrc: jslogo,
  },
  {
    title: '미래의 자바스크립트 미리 써보기',
    description: '',
    dateStr: '2024.07.07',
    path: '/post/js-proposals',
    importMdx: () => import('./js-proposals.mdx'),
    imageSrc: es2024,
  },
];

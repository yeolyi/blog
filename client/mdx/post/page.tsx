import lodash from './assets/lodash.svg?url';
import es2024 from './assets/es2024.png?url';
import eslint from './assets/eslint.svg?url';
import jslogo from './assets/jslogo.svg?url';
import eslintJS from './assets/eslintJS.svg?url';
import { MdxPage } from '../MdxPage';

export let postPageList: MdxPage[] = [
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

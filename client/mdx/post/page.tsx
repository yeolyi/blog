import lodash from './assets/lodash.svg';
import es2024 from './assets/es2024.png';
import eslint from './assets/eslint.svg';
import jslogo from './assets/jslogo.svg';
import { MdxPage } from '../MdxPage';

export let postPageList: MdxPage[] = [
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
  {
    title: 'RSS 테스트',
    description: '',
    dateStr: '2024.08.25',
    path: '/post/test',
    importMdx: () => import('./test.mdx'),
    imageSrc: es2024,
  },
];

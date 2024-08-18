import lodash from './assets/lodash.svg';
import es2024 from './assets/es2024.png';
import eslint from './assets/eslint.svg';
import jslogo from './assets/jslogo.svg';
import { RoutePreview } from '../routePreview';
import { lazy } from 'react';

export let postRoutePreview: RoutePreview[] = [
  {
    title: '가볍게 살펴보는 ESLint',
    description: '',
    dateStr: '2024.07.21',
    path: '/post/eslint',
    Mdx: lazy(() => import('./eslint.mdx')),
    imageSrc: eslint,
  },
  {
    title: '가볍게 살펴보는 Lodash',
    description: '',
    dateStr: '2024.07.20',
    path: '/post/lodash',
    Mdx: lazy(() => import('./lodash.mdx')),
    imageSrc: lodash,
  },
  {
    title: '책에는 없는 JS 기능 구경',
    description: '',
    dateStr: '2024.07.19',
    path: '/post/es2024',
    Mdx: lazy(() => import('./es2024.mdx')),
    imageSrc: jslogo,
  },
  {
    title: '미래의 자바스크립트 미리 써보기',
    description: '',
    dateStr: '2024.07.07',
    path: '/post/js-proposals',
    Mdx: lazy(() => import('./js-proposals.mdx')),
    imageSrc: es2024,
  },
];
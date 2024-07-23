import { PostTileProps } from '@/components/common/PostTile';
import lodash from '@/public/lodash.svg';
import es2024 from '@/public/post/preview/es2024.png';
// import eslint from '@/public/post/preview/eslint.svg';
import jslogo from '@/public/post/preview/jslogo.svg';

export let postTileProps: PostTileProps[] = [
  // {
  //   title: '가볍게 살펴보는 ESLint',
  //   dateStr: '2024.07.21',
  //   href: '/post/eslint',
  //   src: eslint,
  //   objectFit: 'contain',
  // },
  {
    title: '가볍게 살펴보는 Lodash',
    dateStr: '2024.07.20',
    href: '/post/lodash',
    src: lodash,
    objectFit: 'contain',
  },
  {
    title: '책에는 없는 JS 기능 구경',
    dateStr: '2024.07.19',
    href: '/post/es2024',
    src: jslogo,
    objectFit: 'contain',
  },
  {
    title: '미래의 자바스크립트 미리 써보기',
    dateStr: '2024.07.07',
    href: '/post/js-proposals',
    src: es2024,
    objectFit: 'cover',
  },
];

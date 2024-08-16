import { PostContainer, PostTile } from './tile/PostTile';
import { PostTileProps } from '@/routers/main/components/tile/PostTile';
import lodash from '../assets/lodash.svg';
import es2024 from '../assets/es2024.png';
import eslint from '../assets/eslint.svg';
import jslogo from '../assets/jslogo.svg';

export let PostCarousel = () => {
  return (
    <PostContainer>
      {postTileProps.map((prop) => (
        <PostTile key={prop.title} {...prop} />
      ))}
    </PostContainer>
  );
};

let postTileProps: PostTileProps[] = [
  {
    title: '가볍게 살펴보는 ESLint',
    dateStr: '2024.07.21',
    href: '/post/eslint',
    src: eslint,
    objectFit: 'contain',
  },
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

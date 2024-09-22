import { MdxPage } from '@/client/types/page';

export const jsPageList: MdxPage[] = [
  {
    title: '값',
    description:
      '자바스크립트에 있는 값들의 종류와 형변환 과정을 공부했습니다.',
    path: '/js/value',
    importMdx: () => import('./value.mdx'),
  },
  {
    title: '연산자',
    description:
      '값들을 연산자로 조합해 새로운 값을 만드는 방법을 공부했습니다.',
    path: '/js/expression',
    importMdx: () => import('./expression.mdx'),
  },
  {
    title: '구문',
    description: '여러 구문을 모아 프로그램을 만드는 방법을 공부했습니다.',
    path: '/js/statement',
    importMdx: () => import('./statement.mdx'),
  },
  {
    title: '객체',
    description: '자바스크립트의 가장 중요한 주제인 객체를 공부했습니다.',
    path: '/js/object',
    importMdx: () => import('./object.mdx'),
  },
  {
    title: '배열',
    description:
      '다른 언어들과 미묘하게 다른 자바스크립트의 배열을 공부했습니다.',
    path: '/js/array',
    importMdx: () => import('./array.mdx'),
  },
  {
    title: '함수',
    description:
      '맥락에 따라 다르게 동작하는 자바스크립트의 함수와 this 키워드를 공부했습니다.',
    path: '/js/function',
    importMdx: () => import('./function.mdx'),
  },
  {
    title: '클래스',
    description:
      '클래스의 성질이 자바스크립트에서 어떻게 구현되는지 공부했습니다.',
    path: '/js/class',
    importMdx: () => import('./class.mdx'),
  },
  {
    title: '모듈',
    description:
      '모듈이 왜 필요한지, 자바스크립트에 어떤 종류의 모듈 시스템이 있는지 공부했습니다.',
    path: '/js/module',
    importMdx: () => import('./module.mdx'),
  },
  {
    title: '라이브러리',
    description:
      '자바스크립트 표준 라이브러리에 어떤 것들이 있는지 공부했습니다.',
    path: '/js/library',
    importMdx: () => import('./library.mdx'),
  },
  {
    title: '이터레이터',
    description:
      '데이터에 순서대로 접근하는 과정을 어떻게 추상화했는지 공부했습니다.',
    path: '/js/iterator',
    importMdx: () => import('./iterator.mdx'),
  },
  {
    title: '비동기 프로그래밍',
    description:
      '자바스크립트가 비동기 작업을 어떻게 표현하며 어떻게 처리하도록하는지 공부했습니다.',
    path: '/js/async',
    importMdx: () => import('./async.mdx'),
  },
  {
    title: '메타 프로그래밍',
    description:
      '코드를 수정하는 코드인 메타 프로그래밍에 관련된 API들을 공부했습니다.',
    path: '/js/meta',
    importMdx: () => import('./meta.mdx'),
  },
];

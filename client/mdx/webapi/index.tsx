import { MdxPage } from '@/client/types/page';

export const webapiPageList: MdxPage[] = [
  {
    title: 'Web API 기초',
    description: '브라우저에서 JS가 어떤 과정으로 실행되는지 배웠습니다',
    path: '/webapi/basic',
    importMdx: () => import('./basic.mdx'),
  },
  {
    title: '이벤트',
    description:
      '브라우저에서 이벤트가 어떻게 발생되고 전파되는지 공부했습니다.',
    path: '/webapi/event',
    importMdx: () => import('./event.mdx'),
  },
  {
    title: 'Document 조작',
    description: 'JS로 웹페이지의 내용을 바꾸는 방법을 공부했습니다.',
    path: '/webapi/document',
    importMdx: () => import('./document.mdx'),
  },
  {
    title: 'CSS 조작',
    description: 'JS로 CSS 스타일을 바꾸는 방법을 공부했습니다',
    path: '/webapi/css',
    importMdx: () => import('./css.mdx'),
  },
  {
    title: '좌표와 스크롤',
    description:
      '요소의 크기와 위치, 스크롤을 알고 조작하는 법을 공부했습니다.',
    path: '/webapi/geometry',
    importMdx: () => import('./geometry.mdx'),
  },
  {
    title: '컴포넌트',
    description: '네이티브로 컴포넌트를 구현하는 방법을 공부했습니다',
    path: '/webapi/mdx',
    importMdx: () => import('./component.mdx'),
  },
  {
    title: 'SVG',
    description:
      '해상도 상관없이 깔끔하게 렌더링되는 이미지 포맷을 공부했습니다',
    path: '/webapi/svg',
    importMdx: () => import('./svg.mdx'),
  },
  {
    title: 'Navigation',
    description:
      '히스토리 관련된 API들과 함께 pushState()로 상태를 관리하는 방법을 공부했습니다.',
    path: '/webapi/navigation',
    importMdx: () => import('./navigation.mdx'),
  },
  {
    title: 'Network',
    description:
      '자바스크립트로 직접 네트워크 요청을 보내는 방법을 공부했습니다.',
    path: '/webapi/network',
    importMdx: () => import('./network.mdx'),
  },
  {
    title: 'Storage',
    description: '브라우저상에 데이터를 저장하는 다양한 방법을 공부했습니다.',
    path: '/webapi/storage',
    importMdx: () => import('./storage.mdx'),
  },
  {
    title: 'Worker',
    description: '별개의 스레드로 JS 코드를 실행시키는 방법을 공부했습니다.',
    path: '/webapi/worker',
    importMdx: () => import('./worker.mdx'),
  },
];

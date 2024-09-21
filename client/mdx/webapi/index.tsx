import { MdxPage } from '@/client/types/page';

export let webapiPageList: MdxPage[] = [
  {
    title: 'Web API 기초',
    description: '브라우저에서 JS가 어떤 과정으로 실행되는지 배웠습니다',
    path: '/webapi/basic',
    importMdx: () => import('./basic.mdx'),
    exampleCode: `<script>
  setInterval(() => {
    let str = new Date().toLocaleTimeString();
    document.body.innerText = str;
  }, 1000);
</script>`,
  },
  {
    title: '이벤트',
    description:
      '브라우저에서 이벤트가 어떻게 발생되고 전파되는지 공부했습니다.',
    path: '/webapi/event',
    importMdx: () => import('./event.mdx'),
    exampleCode: `<p></p>
<script>
  let p = document.querySelector('p');
  let cnt = 0;
  addEventListener('click', () => {
    p.innerText = ++cnt;
  });
</script>`,
  },
  {
    title: 'Document 조작',
    description: 'JS로 웹페이지의 내용을 바꾸는 방법을 공부했습니다.',
    path: '/webapi/document',
    importMdx: () => import('./document.mdx'),
    exampleCode: `<p></p>
<script>
  let p = document.querySelector('p');
  p.innerText = "Hello, World!";
</script>`,
  },
  {
    title: 'CSS 조작',
    description: 'JS로 CSS 스타일을 바꾸는 방법을 공부했습니다',
    path: '/webapi/css',
    importMdx: () => import('./css.mdx'),
    exampleCode: `<p>Hello!</p>
<script>
  let p = document.querySelector('p');
  p.style.color = 'royalblue'
</script>`,
  },
  {
    title: '좌표와 스크롤',
    description:
      '요소의 크기와 위치, 스크롤을 알고 조작하는 법을 공부했습니다.',
    path: '/webapi/geometry',
    importMdx: () => import('./geometry.mdx'),
    exampleCode: `<script>
  addEventListener("click", (e) => {
    console.log(e.offsetX, e.offsetY);
    console.log(e.screenX, e.screenY);
  });
</script>`,
  },
  {
    title: '컴포넌트',
    description: '네이티브로 컴포넌트를 구현하는 방법을 공부했습니다',
    path: '/webapi/mdx',
    importMdx: () => import('./component.mdx'),
    exampleCode: `<div>light DOM</div>
<script>
  let shadowHost = document.querySelector('div');
  let shadowRoot = shadowHost.attachShadow({ mode: 'open' });
  shadowRoot.innerHTML = '<p>shadow DOM <slot></slot></p>'
</script>`,
  },
  {
    title: 'SVG',
    description:
      '해상도 상관없이 깔끔하게 렌더링되는 이미지 포맷을 공부했습니다',
    path: '/webapi/svg',
    importMdx: () => import('./svg.mdx'),
    exampleCode: `<svg version="1.1" width="50" height="50" xmlns="http://www.w3.org/2000/svg">
  <circle cx="25" cy="25" r="25" fill="black" />
  <text x="25" y="32" font-size="18" text-anchor="middle" fill="white">
    SVG
  </text>
</svg>`,
  },
  {
    title: 'Navigation',
    description:
      '히스토리 관련된 API들과 함께 pushState()로 상태를 관리하는 방법을 공부했습니다.',
    path: '/webapi/navigation',
    importMdx: () => import('./navigation.mdx'),
    exampleCode: `<button>click me</button>
<script>
  document.querySelector('button').addEventListener('click', () => {
    location = 'https://yeolyi.com';
  });
</script>`,
  },
  {
    title: 'Network',
    description:
      '자바스크립트로 직접 네트워크 요청을 보내는 방법을 공부했습니다.',
    path: '/webapi/network',
    importMdx: () => import('./network.mdx'),
    exampleCode: `<script>
  fetch('https://jsonplaceholder.typiexampleCode.com/todos/1')
    .then(resp => resp.json())
    .then(json => console.log(json.title))
</script>`,
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

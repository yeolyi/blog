import Sandbox from '@/components/code/sandbox/Sandbox';
import { TileProps } from '@/components/gallery/Tile';

let _webTileProps: TileProps[] = [
  {
    name: 'Web API 기초',
    description: '브라우저에서 JS가 어떤 과정으로 실행되는지 배웠습니다',
    // concepts: 'defer, async, DOM, SOP, XSS',
    href: '/webapi/basic',
    code: `<script>
  setInterval(() => {
    let str = new Date().toLocaleTimeString();
    document.body.innerText = str;
  }, 1000);
</script>`,
  },
  {
    name: '이벤트',
    description:
      '브라우저에서 이벤트가 어떻게 발생되고 전파되는지 공부했습니다.',
    // concepts: '이벤트의 등록, 전파, 취소, 디스패치',
    href: '/webapi/event',
    code: `<p></p>
<script>
  let p = document.querySelector('p');
  let cnt = 0;
  addEventListener('click', () => {
    p.innerText = ++cnt;
  });
</script>`,
  },
  {
    name: 'Document 조작',
    description: 'JS로 웹페이지의 내용을 바꾸는 방법을 공부했습니다.',
    // concepts: 'Element의 쿼리, 순회, 속성, 생성, 삽입, 삭제',
    href: '/webapi/document',
    code: `<p></p>
<script>
  let p = document.querySelector('p');
  p.innerText = "Hello, World!";
</script>`,
  },
  {
    name: 'CSS 조작',
    description: 'JS로 CSS 스타일을 바꾸는 방법을 공부했습니다',
    href: '/webapi/css',
    code: `<p>Hello!</p>
<script>
  let p = document.querySelector('p');
  p.style.color = 'royalblue'
</script>`,
  },
  {
    name: '좌표와 스크롤',
    description:
      '요소의 크기와 위치, 스크롤을 알고 조작하는 법을 공부했습니다.',
    href: '/webapi/geometry',
    code: `<script>
  addEventListener("click", (e) => {
    console.log(e.offsetX, e.offsetY);
    console.log(e.screenX, e.screenY);
  });
</script>`,
  },
  {
    name: '컴포넌트',
    description: '네이티브로 컴포넌트를 구현하는 방법을 공부했습니다',
    href: '/webapi/component',
    code: `<div>light DOM</div>
<script>
  let shadowHost = document.querySelector('div');
  let shadowRoot = shadowHost.attachShadow({ mode: 'open' });
  shadowRoot.innerHTML = '<p>shadow DOM <slot></slot></p>'
</script>`,
  },
  {
    name: 'SVG',
    description:
      '해상도 상관없이 깔끔하게 렌더링되는 이미지 포맷을 공부했습니다',
    href: '/webapi/svg',
    code: `<svg version="1.1" width="50" height="50" xmlns="http://www.w3.org/2000/svg">
  <circle cx="25" cy="25" r="25" fill="black" />
  <text x="25" y="32" font-size="18" text-anchor="middle" fill="white">
    SVG
  </text>
</svg>`,
  },
  {
    name: 'Navigation',
    description:
      '히스토리 관련된 API들과 함께 pushState()로 상태를 관리하는 방법을 공부했습니다.',
    href: '/webapi/navigation',
    code: `<button>click me</button>
<script>
  document.querySelector('button').addEventListener('click', () => {
    location = 'https://yeolyi.com';
  });
</script>`,
  },
  {
    name: 'Network',
    description:
      '자바스크립트로 직접 네트워크 요청을 보내는 방법을 공부했습니다.',
    href: '/webapi/network',
    code: `<script>
  fetch('https://jsonplaceholder.typicode.com/todos/1')
    .then(resp => resp.json())
    .then(json => console.log(json.title))
</script>`,
  },
  {
    name: 'Storage',
    description: '브라우저상에 데이터를 저장하는 다양한 방법을 공부했습니다.',
    href: '/webapi/storage',
  },
  {
    name: 'Worker',
    description: '별개의 스레드로 JS 코드를 실행시키는 방법을 공부했습니다.',
    href: '/webapi/worker',
  },
].map((x) => ({
  ...x,
  children: x.code && (
    <Sandbox
      presetName="html"
      code={x.code}
      norefresh
      iframeHeight={70}
      consoleFit
    />
  ),
  textColor: 'text-white',
}));

export let webTileProps = _webTileProps.map((x) => ({
  ...x,
  style: {
    background: `linear-gradient(to right, #232526, #414345)`,
  },
}));

import { TileProps } from '@/components/gallery/Tile';

let _webTileProps: TileProps[] = [
  {
    name: 'Web API 기초',
    description: '브라우저에서 JS가 어떤 과정으로 실행되는지 배웠습니다',
    concepts: 'defer, async, DOM, SOP, XSS',
    href: '/webapi/basic',
    content: {
      type: 'html',
      code: `<script>
  setInterval(() => {
    let str = new Date().toLocaleTimeString();
    document.body.innerText = str;
  }, 1000);
</script>`,
    },
  },
  {
    name: '이벤트',
    description:
      '브라우저에서 이벤트가 어떻게 발생되고 전파되는지 공부했습니다.',
    concepts: '이벤트의 등록, 전파, 취소, 디스패치',
    href: '/webapi/event',
    content: {
      type: 'html',
      code: `<h1></h1>
<script>
  let h = document.querySelector('h1');
  let cnt = 0;
  addEventListener('click', () => {
    h.innerText = ++cnt;
  });
</script>`,
    },
  },
  {
    name: 'Document 조작',
    description: 'JS로 웹페이지의 내용을 바꾸는 방법을 공부했습니다.',
    concepts: 'Element의 쿼리, 순회, 속성, 생성, 삽입, 삭제',
    href: '/webapi/document',
    content: {
      type: 'html',
      code: `<p></p>
<script>
  let p = document.querySelector('p');
  p.innerText = "Hello, World!";
</script>`,
    },
  },
  {
    name: 'CSS 조작',
    description: 'JS로 CSS 스타일을 바꾸는 방법을 공부했습니다',
    href: '/webapi/css',
  },
];

export let webTileProps = _webTileProps.map((x) => ({
  ...x,
  style: {
    backgroundColor: '#083e98',
  },
}));

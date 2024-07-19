import Sandbox from '@/components/code/sandbox/Sandbox';
import { TileProps } from '@/components/gallery/Tile';

export let cssTileProps: TileProps[] = [
  {
    name: 'CSS 기초',
    description:
      'CSS가 크게 무엇으로 구성되는지, HTML과 어떻게 연결되는지 공부했습니다.',
    href: '/css/fundamentals',
    code: `<p>
  This p element is a block-level element. The strongly emphasized
  text <strong>is an inline element</strong>.
</p>`,
  },
  {
    name: 'CSS 선택자',
    description:
      'HTML의 트리 구조를 활용해 구조적 상황에 따라 요소에 스타일을 적용해봅시다.',
    href: '/css/selectors',
    code: `<style>
  a[href$='.pdf' i] { 
    color: red; 
  }
</style>
<a href="/sample.PDF">PDF</a>`,
  },
].map((x) => ({
  ...x,
  children: x.code && (
    <Sandbox
      presetName="html"
      code={x.code}
      norefresh
      iframeHeight={100}
      consoleFit
    />
  ),
  style: {
    backgroundImage: `linear-gradient(
  45deg,
  hsl(228deg 78% 52%) 1%,
  hsl(226deg 82% 53%) 51%,
  hsl(224deg 85% 54%) 49%,
  hsl(222deg 88% 55%) 99%
)`,
  },
  textColor: 'text-white',
}));

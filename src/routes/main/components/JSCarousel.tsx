import Sandbox from '@/components/code/sandbox/Sandbox';
import { Tile, TileProps } from '@/routes/main/components/carousel/Tile';
import jsbook from '../assets/jsbook.png';

import { Carousel } from '@/routes/main/components/carousel/Carousel';
import { jsPostPreview } from '@/mdx/js/preview';

export let JSCarousel = () => (
  <Carousel>
    {tileList.map((prop, idx) => (
      <Tile key={idx} {...prop} />
    ))}
  </Carousel>
);

let firstTile = {
  title: '소개',
  description:
    'JS를 복습하며 몰랐었고 흥미로웠던 내용 위주로 기록했습니다. 아래 책으로 공부했어요.',
  children: (
    <div className="overflow-hidden rounded-[13px]">
      <img src={jsbook} alt="자바스크립트 책 표지" />
    </div>
  ),
};

let tileList: TileProps[] = [
  firstTile,
  ...jsPostPreview.map((x) => ({
    ...x,
    url: `/js/${x.fileName}`,
    children: (
      <Sandbox
        presetName="js"
        code={x.exampleCode ?? ''}
        norefresh
        consoleFit
      />
    ),
  })),
].map((x) => ({
  ...x,
  style: {
    backgroundImage: `linear-gradient(
        163deg,
    hsl(51deg 97% 59%) 1%,
    hsl(50deg 93% 58%) 51%,
    hsl(49deg 90% 56%) 49%,
    hsl(48deg 86% 54%) 99%
  )`,
  },
  textColor: 'text-textblack',
}));

import Sandbox from '@/client/components/code/sandbox/Sandbox';
import { Carousel } from './carousel/Carousel';
import { Tile, TileProps } from './carousel/Tile';
import { webapiPageList } from '../../../mdx/webapi';

export let WebCarousel = () => {
  return (
    <Carousel>
      {webTileProps.map((prop, idx) => (
        <Tile key={idx} {...prop} />
      ))}
    </Carousel>
  );
};

let webTileProps: TileProps[] = webapiPageList.map((x) => ({
  ...x,
  url: x.path,
  children: x.exampleCode && (
    <Sandbox
      presetName="html"
      code={x.exampleCode}
      norefresh
      iframeHeight={70}
      consoleFit
    />
  ),
  textColor: 'text-white',
  style: { background: 'linear-gradient(to right, #232526, #414345)' },
}));

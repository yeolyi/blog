import Sandbox from '@/components/code/sandbox/Sandbox';
import { Carousel } from './carousel/Carousel';
import { Tile, TileProps } from './carousel/Tile';
import { webapiPreview } from '@/mdx/webapi/preview';

export let WebCarousel = () => {
  return (
    <Carousel>
      {webTileProps.map((prop, idx) => (
        <Tile key={idx} {...prop} />
      ))}
    </Carousel>
  );
};

let webTileProps: TileProps[] = webapiPreview.map((x) => ({
  ...x,
  url: `/webapi/${x.fileName}`,
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

import Sandbox from '@/components/code/sandbox/Sandbox';
import { TileProps } from '@/components/gallery/Tile';

export let cssTileProps: TileProps[] = [
  {
    name: 'CSS 기초',
    description: '',
    href: '/css/fundamentals',
    code: ``,
  },
].map((x) => ({
  ...x,
  children: x.code && (
    <Sandbox presetName="html" code={x.code} norefresh iframeHeight={70} />
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

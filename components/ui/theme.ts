export const bgMap = {
  green:
    'bg-green-600 hover:bg-green-700 active:bg-green-800 disabled:bg-green-500/50',
  gray: 'bg-stone-700 hover:bg-stone-800 active:bg-stone-900 disabled:bg-stone-700',
  red: 'bg-red-500',
  transparent: 'bg-transparent hover:text-white/80 active:text-white/60',
};

export const border = 'outline-stone-700 outline';

export type Bg = keyof typeof bgMap;

export const skewOnHover =
  'transition-transform group-hover:-skew-x-15 group-active:-skew-x-25 ease-in-out duration-200';

export const layerBg = 'bg-stone-800';

export const successBg = 'bg-green-500/30';
export const failBg = 'bg-red-500/30';

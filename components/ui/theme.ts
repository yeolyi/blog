export const bgMap = {
  green: 'bg-[#4CAF50]',
  gray: 'bg-stone-700 hover:bg-stone-800 active:bg-stone-900 disabled:bg-stone-700',
  red: 'bg-red-500',
  transparent: 'bg-transparent',
};

export const border = 'border-stone-700 border';

export type Bg = keyof typeof bgMap;

export const skewOnHover =
  'transition-transform group-hover:-skew-x-10 group-active:-skew-x-20 ease-in-out duration-200';

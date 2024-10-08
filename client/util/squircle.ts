import { getSvgPath } from 'figma-squircle';

const cache = new Map<number, Map<number, string>>();

export const getSquirclePath = (
  width: number,
  height: number,
  cornerRadius: number,
) => {
  const cached = cache.get(width)?.get(height);
  if (cached) return cached;

  const val = getSvgPath({
    width,
    height,
    cornerSmoothing: 1,
    cornerRadius,
  });

  if (!cache.get(width)) cache.set(width, new Map());
  cache.get(width)?.set(height, val);

  return val;
};

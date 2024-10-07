import { getSvgPath } from 'figma-squircle';

export const circleSize = {
  width: 50,
  height: 50,
  borderRadius: 25,
};

export const squircleSize = {
  width: Math.min(409, import.meta.env.SSR ? 999 : innerWidth - 30),
  height: 200,
  borderRadius: 25,
};

export const squirclePath = getSvgPath({
  ...squircleSize,
  cornerSmoothing: 1,
  cornerRadius: squircleSize.borderRadius,
});

export const borderWidth = 1;

export const circleBorderSize = {
  width: circleSize.width + 2 * borderWidth,
  height: circleSize.height + 2 * borderWidth,
  borderRadius: circleSize.borderRadius,
};

export const squircleBorderSize = {
  width: squircleSize.width + 2 * borderWidth,
  height: squircleSize.height + 2 * borderWidth,
  borderRadius: squircleSize.borderRadius,
};

export const squircleBorderPath = getSvgPath({
  ...squircleBorderSize,
  width: squircleSize.width + 2 * borderWidth,
  height: squircleSize.height + 2 * borderWidth,
  cornerSmoothing: 1,
  cornerRadius: squircleSize.borderRadius,
});

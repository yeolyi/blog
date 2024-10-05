export const defaultSVGSize = {
  width: 40,
  height: 40,
  borderRadius: 20,
};

export const ultraSvgSize = {
  width: Math.min(409, import.meta.env.SSR ? 999 : innerWidth - 30),
  height: 200,
  borderRadius: 25,
};

import { getSvgPath } from 'figma-squircle';

export const defaultPath = getSvgPath({
  ...defaultSVGSize,
  cornerSmoothing: 1,
  cornerRadius: defaultSVGSize.borderRadius,
});

export const ultraPath = getSvgPath({
  ...ultraSvgSize,
  cornerSmoothing: 1,
  cornerRadius: ultraSvgSize.borderRadius,
});

export const borderWidth = 1;

export const defaultBorderSize = {
  width: defaultSVGSize.width + 2 * borderWidth,
  height: defaultSVGSize.height + 2 * borderWidth,
  borderRadius: defaultSVGSize.borderRadius,
};

export const ultraBorderSize = {
  width: ultraSvgSize.width + 2 * borderWidth,
  height: ultraSvgSize.height + 2 * borderWidth,
  borderRadius: ultraSvgSize.borderRadius,
};

export const defaultBorderPath = getSvgPath({
  ...defaultBorderSize,
  cornerSmoothing: 1,
  cornerRadius: defaultSVGSize.borderRadius,
});

export const ultraBorderPath = getSvgPath({
  ...ultraBorderSize,
  width: ultraSvgSize.width + 2 * borderWidth,
  height: ultraSvgSize.height + 2 * borderWidth,
  cornerSmoothing: 1,
  cornerRadius: ultraSvgSize.borderRadius,
});

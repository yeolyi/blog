import { getSquirclePath } from '@/client/util/squircle';
import { useEffect } from 'react';

export const useSquircle = (
  element: HTMLElement | null,
  borderRadius: number,
) => {
  useEffect(() => {
    if (!element) return;

    const onResize = () => {
      const clipPath = getSquirclePath(
        element.clientWidth,
        element.clientHeight,
        borderRadius,
      );
      element.style.clipPath = `path('${clipPath}')`;
    };

    onResize();

    addEventListener('resize', onResize);
    return () => {
      removeEventListener('resize', onResize);
    };
  }, [element]);
};

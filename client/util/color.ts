import { prominent } from 'color.js';
import { useState, useEffect } from 'react';

export const useImageColor = (src?: string) => {
  const [color, setColor] = useState<string>();

  useEffect(() => {
    if (src) {
      prominent(src, { amount: 2, format: 'hex' }).then((color) => {
        const filtered = (color as string[]).filter(
          (x) => x !== '#000000' && x !== '#ffffff',
        );
        if (filtered.length !== 0) setColor(filtered[0]);
      });
    }
  }, []);

  return color;
};

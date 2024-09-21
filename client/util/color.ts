import { prominent } from 'color.js';
import { useState, useEffect } from 'react';

// https://gist.github.com/krabs-github/ec56e4f1c12cddf86ae9c551aa9d9e04
export const lightOrDark = (hex: string) => {
  const [r, g, b] = hexToRgb(hex);

  // HSP equation from http://alienryderflex.com/hsp.html
  const hsp = Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b));

  return 127.5 < hsp ? 'light' : 'dark';
};

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

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)!;
  return [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16),
  ];
}

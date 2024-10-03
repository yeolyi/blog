import { COL, ROW_OFFSET } from '@/client/pages/components/CserealBg/constants';

export const strToBinary = (str: string) => {
  return [...str]
    .map((char) => {
      const binaryStr = char.charCodeAt(0).toString(2);
      const fixedWidthBinaryStr = binaryStr.padStart(8, '0');
      const binaryArr = [...fixedWidthBinaryStr].map((x) => x === '1');
      return binaryArr;
    })
    .flat();
};

export const getCoord = (idx: number) => {
  const col = Math.floor(idx / COL);
  const row = (idx % COL) + ROW_OFFSET[col];
  return [row, col] as const;
};

export const setScale = (element: HTMLElement, scale: number, ms?: number) => {
  setTimeout(() => {
    element.style.transform = `scale(${scale})`;
  }, ms);
};

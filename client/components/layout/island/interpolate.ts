import { zip } from 'es-toolkit';

const f = (a: number, b: number, val: number) => a + (b - a) * val;

export const interpolateSvg = (from: string, to: string) => {
  const fromArr = from.split(' ');
  const toArr = to.split(' ');
  const zipped = zip(fromArr, toArr);

  return (val: number) => {
    const ret = [];

    for (const [i, j] of zipped) {
      if (isNaN(+i)) ret.push(i);
      else ret.push(Number.isNaN(+i) ? ret.push(i) : f(+i, +j, val));
    }

    ret.push('Z');

    return ret.join(' ');
  };
};

'use server';

import { getErrMessage } from '@/utils/string';
import sharp from 'sharp';

// https://github.com/lovell/sharp/issues/4250
// webp로 바꿔야하나...
export const fileToAVIFAction = async (file: File) => {
  const url = URL.createObjectURL(file);
  try {
    const resp = await fetch(url);
    const buffer = await resp.arrayBuffer();
    const avif = await sharp(buffer).avif().toBuffer();
    return avif;
  } catch (e) {
    return getErrMessage(e);
  } finally {
    URL.revokeObjectURL(url);
  }
};

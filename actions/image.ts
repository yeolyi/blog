'use server';

import { getErrMessage } from '@/utils/string';
import sharp from 'sharp';

export const urlToAVIFAction = async (url: string) => {
  try {
    const resp = await fetch(url);
    const buffer = await resp.arrayBuffer();
    const avif = await sharp(buffer).avif().toBuffer();
    return avif;
  } catch (e) {
    return getErrMessage(e);
  }
};

export const fileToAVIFAction = async (file: File) => {
  const avif = await urlToAVIFAction(URL.createObjectURL(file));
  URL.revokeObjectURL(URL.createObjectURL(file));
  return avif;
};

'use server';

import { getErrMessage } from '@/utils/string';
import sharp from 'sharp';

export const toAVIFAction = async (url: string) => {
  try {
    const resp = await fetch(url);
    const buffer = await resp.arrayBuffer();
    const avif = await sharp(buffer).avif().toBuffer();
    return avif;
  } catch (e) {
    return getErrMessage(e);
  }
};

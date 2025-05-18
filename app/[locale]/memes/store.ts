import { atomWithStorage } from 'jotai/utils';

export const memeImagesAtom = atomWithStorage<string[]>('memeImages', []);
export const selectedMemeImagesAtom = atomWithStorage<string[]>(
  'selectedMemeImages',
  [],
);

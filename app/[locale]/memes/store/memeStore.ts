import type { Meme, Tag } from '@/types/meme';
import { shuffleArray } from '@/utils/array';
import { atom } from 'jotai';

// 기본 상태 원자들
export const keyAtom = atom(0);
export const memesAtom = atom<Meme[]>([]);
export const allTagsAtom = atom<Tag[]>([]);
export const selectedTagAtom = atom<string | undefined>(undefined);
export const selectedIdAtom = atom<string | null>(null);
export const isHiddenModeAtom = atom(false);

export const displayedMemesAtom = atom<Meme[]>((get) => {
  const memes = get(memesAtom);
  const selectedTag = get(selectedTagAtom);
  const isHiddenMode = get(isHiddenModeAtom);

  if (isHiddenMode) {
    return memes.filter((meme) => meme.hidden);
  }

  if (!selectedTag) {
    return memes.filter((meme) => !meme.hidden);
  }

  return memes
    .filter((meme) => !meme.hidden)
    .filter((meme) =>
      meme.meme_tags.some((memeTag) => memeTag.tags.name === selectedTag),
    );
});

// 밈 관리 함수들을 위한 원자들
export const updateMemeAtom = atom(null, (get, set, updatedMeme: Meme) => {
  const memes = get(memesAtom);
  set(
    memesAtom,
    memes.map((meme) => (meme.id === updatedMeme.id ? updatedMeme : meme)),
  );

  const selectedId = get(selectedIdAtom);
  if (selectedId === updatedMeme.id) {
    set(selectedIdAtom, updatedMeme.id);
  }

  set(keyAtom, get(keyAtom) + 1);
});

// 비즈니스 로직 함수들을 위한 원자들
export const shuffleMemesAtom = atom(null, (get, set) => {
  set(memesAtom, shuffleArray(get(memesAtom)));
  set(keyAtom, get(keyAtom) + 1);
});

export const changeTagAtom = atom(null, async (get, set, tag: string) => {
  const currentTag = get(selectedTagAtom);
  if (currentTag === tag) {
    set(selectedTagAtom, undefined);
  } else {
    set(selectedTagAtom, tag);
  }

  set(selectedIdAtom, null);
  set(isHiddenModeAtom, false);
  set(keyAtom, get(keyAtom) + 1);
});

export const toggleHiddenMemesAtom = atom(null, (get, set) => {
  set(isHiddenModeAtom, !get(isHiddenModeAtom));
  set(keyAtom, get(keyAtom) + 1);
});

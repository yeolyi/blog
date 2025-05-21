import { deleteMemeFromDB } from '@/db/meme/delete';
import { getMemesFromDB } from '@/db/meme/read';
import { type UpdateMemeAtDBProps, updateMemeAtDB } from '@/db/meme/update';
import { getMemeTagIdsAtDB, getTagsAtDB } from '@/db/memeTag/read';
import { memeTagKey, memesByTagKey, tagsKey } from '@/swr/key';
import useSWR, { mutate } from 'swr';

export const NO_TAG_ID = 'all';

// TODO: 무효화 키 정리
export const useMemes = (tagId: string) => {
  return useSWR(memesByTagKey(tagId), () =>
    getMemesFromDB(tagId === NO_TAG_ID ? undefined : tagId),
  );
};

export const useTags = () => {
  return useSWR(tagsKey, getTagsAtDB);
};

export const useMemeTagIds = (memeId: string) => {
  return useSWR(memeTagKey(memeId), () => getMemeTagIdsAtDB(memeId));
};

export const updateMeme = async (props: UpdateMemeAtDBProps) => {
  await updateMemeAtDB(props);
  mutate(tagsKey);
  for (const tagId of props.tags ?? []) {
    await mutate(memesByTagKey(tagId));
    await mutate(memeTagKey(tagId));
  }
  await mutate(memesByTagKey(NO_TAG_ID));
};

export const deleteMeme = async (memeId: string) => {
  await deleteMemeFromDB(memeId);
  mutate(tagsKey);
  await mutate(memesByTagKey(NO_TAG_ID));
};

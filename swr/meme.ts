import useSWR, { mutate } from 'swr';
import { getMemesFromDB } from '@/db/meme/read';
import { type UpdateMemeAtDBProps, updateMemeAtDB } from '@/db/meme/update';
import {
	getMemeTagIdsAtDB,
	getMemeTagsAtDB,
	getTagsAtDB,
} from '@/db/memeTag/read';
import { memesByTagKey, memeTagKey, tagsKey } from '@/swr/key';

export const NO_TAG_ID = 'all';

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

export const updateMeme = async (
	props: UpdateMemeAtDBProps,
	prevKeys: string[],
) => {
	await updateMemeAtDB(props);
	mutate(tagsKey);

	const tagIds = [...(props.tags ?? []), ...(prevKeys ?? [])];

	for (const tagId of tagIds) {
		await mutate(memesByTagKey(tagId));
		await mutate(memeTagKey(tagId));
		await mutate(memesByTagKey(NO_TAG_ID));
	}
	await mutate(memesByTagKey(NO_TAG_ID));
};

export const useMemeTags = (memeId: string) => {
	return useSWR(memeTagKey(memeId), () => getMemeTagsAtDB(memeId));
};

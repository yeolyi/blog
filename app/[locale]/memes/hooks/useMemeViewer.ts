import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { getRandomMemesFromDB } from '@/db/meme/read';
import { useRouter } from '@/i18n/navigation';
import { NO_TAG_ID, useMemes, useTags } from '@/swr/meme';
import type { Meme } from '@/types/helper.types';
import { shuffled } from '@/utils/array';

export const useMemeViewer = (): {
	tags: { id: string; name: string }[];
	selectedTag: string;
	memes: Meme[];
	onSelectTag: (tagId: string) => void;
	onShuffle: () => Promise<void>;
} => {
	const searchParams = useSearchParams();
	const router = useRouter();

	const { data: _tags } = useTags();
	const tagSearchParam = searchParams.get('tag');
	const selectedTag = tagSearchParam ?? NO_TAG_ID;

	const { data: dbMemes } = useMemes(selectedTag);
	const [memes, setMemes] = useState<Meme[]>(dbMemes ?? []);

	useEffect(() => {
		setMemes(dbMemes ?? []);
	}, [dbMemes]);

	const tags = useMemo(
		() => [{ id: NO_TAG_ID, name: '전체' }, ...(_tags ?? [])],
		[_tags],
	);

	const onSelectTag = useCallback(
		(tagId: string) => {
			router.push(`/memes?tag=${tagId}`);
		},
		[router],
	);

	const onShuffle = useCallback(async () => {
		const randomMemes = await getRandomMemesFromDB(20);
		// TODO: as 제거
		setMemes(shuffled(randomMemes ?? []) as Meme[]);
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}, []);

	return {
		tags,
		selectedTag,
		memes,
		onSelectTag,
		onShuffle,
	};
};

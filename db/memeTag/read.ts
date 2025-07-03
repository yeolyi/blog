import supabase from '@/db';

export async function getTagsAtDB() {
	const { data } = await supabase
		.from('tags')
		.select()
		.order('name', { ascending: true })
		.throwOnError();

	// TODO: colocation 어쩌구를 안해서 클라에서 정렬
	return data.sort((a, b) => a.name.localeCompare(b.name));
}

export async function getMemeTagIdsAtDB(memeId: string) {
	// 왜 string | null ??
	const { data } = await supabase
		.from('meme_tags')
		.select('tag_id')
		.eq('meme_id', memeId)
		.throwOnError();

	return (
		data
			.map((tag) => tag.tag_id)
			.filter((id): id is string => id !== null)
			// TODO: colocation 어쩌구를 안해서 클라에서 정렬
			.sort((a, b) => a.localeCompare(b))
	);
}

export async function getMemeTagsAtDB(memeId: string) {
	const { data } = await supabase
		.from('meme_tags')
		.select('tag_id')
		.eq('meme_id', memeId)
		.throwOnError();

	return data;
}

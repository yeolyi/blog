import supabase from '@/db';

export async function getMemeFromDB(
	id: string,
	options?: { includeTags?: boolean },
) {
	const { includeTags = false } = options ?? {};

	if (includeTags) {
		const { data } = await supabase
			.from('memes')
			.select('*, meme_tags(tag_id, tags(id, name))')
			.eq('id', id)
			.single()
			.throwOnError();

		return data;
	}

	const { data } = await supabase
		.from('memes')
		.select('*')
		.eq('id', id)
		.single()
		.throwOnError();

	return data;
}

export async function getMemesFromDB(tagId?: string) {
	if (tagId) {
		const { data } = await supabase
			.from('meme_tags')
			.select(
				`
      meme_id,
      memes(*)
    `,
			)
			.eq('tag_id', tagId)
			.throwOnError();

		return data.map(({ memes }) => memes).filter((meme) => meme !== null);
	}

	const { data } = await supabase
		.from('memes')
		.select('*')
		.eq('hidden', false)
		.order('created_at', { ascending: false })
		.limit(10)
		.throwOnError();

	return data;
}

export async function getRandomMemesFromDB(count: number) {
	const { data } = await supabase.rpc('get_random_memes', {
		p_count: count,
	});

	return data;
}

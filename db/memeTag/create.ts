import supabase from '@/db';

export const connectMemeToTagInDB = async (memeId: string, tagName: string) => {
	// 기존 태그 찾기
	const { data: existingTag } = await supabase
		.from('tags')
		.select('id, name')
		.eq('name', tagName)
		.maybeSingle()
		.throwOnError();

	let tagId: string;

	// 태그가 없으면 새로 생성
	if (!existingTag) {
		const { data: newTag } = await supabase
			.from('tags')
			.insert([{ name: tagName }])
			.select()
			.single()
			.throwOnError();
		tagId = newTag.id;
	} else {
		tagId = existingTag.id;
	}

	// 밈과 태그 연결
	await supabase
		.from('meme_tags')
		.insert([{ meme_id: memeId, tag_id: tagId }])
		.throwOnError();
};

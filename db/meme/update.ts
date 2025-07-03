import supabase from '@/db';
import { connectMemeToTagInDB } from '@/db/memeTag/create';
import { tryDeleteTagAtDB } from '@/db/memeTag/delete';
import { getMemeTagIdsAtDB } from '@/db/memeTag/read';
import type { Meme } from '@/types/helper.types';

export type UpdateMemeAtDBProps = Partial<Meme> &
	Pick<Meme, 'id'> & { tags?: string[] };

export async function updateMemeAtDB({
	id,
	tags,
	...rest
}: UpdateMemeAtDBProps) {
	await supabase.from('memes').update(rest).eq('id', id).throwOnError();

	if (!tags) return;

	// 기존 태그 삭제
	const oldTagIds = await getMemeTagIdsAtDB(id);
	await supabase.from('meme_tags').delete().eq('meme_id', id).throwOnError();
	await Promise.all(oldTagIds.map(tryDeleteTagAtDB));

	// 새 태그 연결
	await Promise.all(tags.map((tagName) => connectMemeToTagInDB(id, tagName)));
}

import supabase from '@/db/createClient';
import { connectMemeToTag } from '@/db/memeTag/create';
import { tryDeleteTag } from '@/db/memeTag/delete';
import { getMemeTagIds } from '@/db/memeTag/read';

export async function updateMeme({
  id,
  title,
  tags,
}: {
  id: string;
  title: string;
  tags?: string[];
}) {
  // title 업데이트
  await supabase.from('memes').update({ title }).eq('id', id).throwOnError();

  // 기존 태그 삭제
  await supabase.from('meme_tags').delete().eq('meme_id', id).throwOnError();
  const oldTagIds = await getMemeTagIds(id);
  await Promise.all(oldTagIds.map(tryDeleteTag));

  // 새 태그 연결
  if (!tags) return;
  await Promise.all(tags.map((tagName) => connectMemeToTag(id, tagName)));
}

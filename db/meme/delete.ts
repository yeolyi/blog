import supabase from '@/db';
import { getMemeFromDB } from '@/db/meme/read';
import { tryDeleteTagAtDB } from '@/db/memeTag/delete';
import { getMemeTagIdsAtDB } from '@/db/memeTag/read';

export async function deleteMemeFromDB(id: string) {
  // 밈 삭제
  await supabase.from('memes').delete().eq('id', id).throwOnError();

  // 태그 삭제
  const tagIds = await getMemeTagIdsAtDB(id);
  await supabase.from('meme_tags').delete().eq('meme_id', id).throwOnError();
  // 태그 수 많아봨자 한자리니 Promise.all로 한번에 처리
  await Promise.all(tagIds.map(tryDeleteTagAtDB));

  // 이미지 삭제
  const { media_url } = await getMemeFromDB(id);
  const fileUrl = new URL(media_url);
  const filePath = fileUrl.pathname.split(
    '/storage/v1/object/public/memes/',
  )[1];

  if (!filePath) throw new Error('filePath is null');

  const { error: storageError } = await supabase.storage
    .from('memes')
    .remove([filePath]);

  if (storageError) throw storageError;
}

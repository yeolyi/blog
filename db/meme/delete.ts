import supabase from '@/db/createClient';
import { getMemeMediaUrlById } from '@/db/meme/read';
import { tryDeleteTag } from '@/db/memeTag/delete';
import { getMemeTagIds } from '@/db/memeTag/read';

export async function deleteMeme(id: string) {
  // 밈 삭제
  await supabase.from('memes').delete().eq('id', id).throwOnError();

  // 태그 삭제
  const tagIds = await getMemeTagIds(id);
  // 태그 수 많아봨자 한자리니 Promise.all로 한번에 처리
  await Promise.all(tagIds.map(tryDeleteTag));

  // 이미지 삭제
  const mediaUrl = await getMemeMediaUrlById(id);
  const fileUrl = new URL(mediaUrl);
  const filePath = fileUrl.pathname.split(
    '/storage/v1/object/public/memes/',
  )[1];

  if (!filePath) throw new Error('filePath is null');

  const { error: storageError } = await supabase.storage
    .from('memes')
    .remove([filePath]);

  if (storageError) throw storageError;
}

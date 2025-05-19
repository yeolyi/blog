import supabase from '@/db/createClient';

export async function getTags() {
  const { data } = await supabase
    .from('tags')
    .select()
    .order('name')
    .throwOnError();

  return data;
}

export async function getMemeTagIds(memeId: string) {
  // 왜 string | null ??
  const { data } = await supabase
    .from('meme_tags')
    .select('tag_id')
    .eq('meme_id', memeId)
    .throwOnError();

  return data
    .map((tag) => tag.tag_id)
    .filter((id): id is string => id !== null);
}

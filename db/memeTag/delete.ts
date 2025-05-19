import supabase from '@/db/createClient';

export const tryDeleteTag = async (tagId: string) => {
  const { count } = await supabase
    .from('meme_tags')
    .select('*', { count: 'exact', head: true })
    .eq('tag_id', tagId)
    .throwOnError();

  if (count === null) {
    throw new Error('count is null');
  }

  if (count === 0) {
    await supabase.from('tags').delete().eq('id', tagId).throwOnError();
  }
};

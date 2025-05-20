import supabase from '@/db';

export async function getRecentMemes() {
  const { data } = await supabase
    .from('memes')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10)
    .throwOnError();

  return data;
}

export async function getMemeMediaUrlById(id: string) {
  const { data } = await supabase
    .from('memes')
    .select('media_url')
    .eq('id', id)
    .single()
    .throwOnError();

  return data?.media_url;
}

export async function getMemeWithTag(id: string) {
  const { data } = await supabase
    .from('memes')
    .select(
      `
      *,
      meme_tags(
        tag_id,
        tags(id, name)
      )
    `,
    )
    .eq('id', id)
    .single()
    .throwOnError();

  return data;
}

export async function getMemesByTag(tagId: string) {
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

export async function getRandomMeme() {
  const { data } = await supabase.rpc('get_random_meme_id').throwOnError();
  return data;
}

import supabase from '@/db';
import type { Meme, Tag } from '@/types/helper.types';

export function getMemeFromDB(id: string): Promise<Omit<Meme, 'embedding'>>;
export function getMemeFromDB(
  id: string,
  options: { includeEmbedding: true },
): Promise<Meme>;
export function getMemeFromDB(
  id: string,
  options: { includeTags: true },
): Promise<Meme & { meme_tags: { tags: Tag }[] }>;
export async function getMemeFromDB(
  id: string,
  options?: { includeEmbedding?: boolean; includeTags?: boolean },
): Promise<Omit<Meme, 'embedding'>> {
  const { includeEmbedding = false, includeTags = false } = options ?? {};

  let columns = includeEmbedding
    ? 'id, media_url, embedding, title, height, width, created_at, updated_at, hidden'
    : 'id, media_url, title, height, width, created_at, updated_at, hidden';

  if (includeTags) columns += ', meme_tags(tag_id, tags(id, name))';

  const { data } = await supabase
    .from('memes')
    .select(columns)
    .eq('id', id)
    .single()
    .throwOnError();

  return data as unknown as Omit<Meme, 'embedding'>;
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

export async function getNoEmbeddingMemesFromDB() {
  const { data } = await supabase
    .from('memes')
    .select('id')
    .is('embedding', null)
    .throwOnError();

  return data.map(({ id }) => id);
}

export async function getMemeIdsFromDB() {
  const { data } = await supabase.from('memes').select('id').throwOnError();
  return data.map(({ id }) => id);
}

export async function matchSimilarMemeAtDB({
  query_id,
  match_threshold,
  match_count,
}: {
  query_id: string;
  match_threshold: number;
  match_count: number;
}) {
  const { data } = await supabase
    .rpc('match_similar_meme', { query_id, match_threshold, match_count })
    .throwOnError();

  return data;
}

export async function getRandomMemesFromDB(count: number) {
  const { data } = await supabase.rpc('get_random_memes', {
    p_count: count,
  });

  return data;
}

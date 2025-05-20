import supabase from '@/db';

export async function toggleEmojiReaction({
  postId,
  emoji,
}: {
  postId: string;
  emoji: string;
}) {
  await supabase
    .rpc('toggle_emoji_reaction', {
      p_post_id: postId,
      p_emoji: emoji,
    })
    .throwOnError();
}

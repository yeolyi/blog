import supabase from '@/db';

export async function addEmojiReactionInDB({
  postId,
  emoji,
  userId,
}: {
  postId: string;
  emoji: string;
  userId: string;
}) {
  await supabase
    .from('emoji_reactions')
    .insert({
      post_id: postId,
      emoji: emoji,
      user_id: userId,
    })
    .throwOnError();
}

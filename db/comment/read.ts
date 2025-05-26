import supabase from '@/db';

export async function getCommentsFromDB(postId: string) {
  const { data: comments } = await supabase
    .rpc('get_comments_with_developer_number', { post_id_param: postId })
    .throwOnError();

  return comments;
}

export async function getEmojiCountsFromDB(postId: string, userId: string) {
  const { data } = await supabase
    .rpc('get_emoji_counts', {
      p_post_id: postId,
      p_user_id: userId,
    })
    .throwOnError();

  return data;
}

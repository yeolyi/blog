import supabase from '@/db';

export async function getCommentsFromDB(postId: string) {
  const { data: comments } = await supabase
    .rpc('get_comments_with_developer_number', { post_id_param: postId })
    .throwOnError();

  return comments;
}

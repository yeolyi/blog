import supabase from '@/db';

export async function createComment(
  postId: string,
  content: string,
  userId: string,
) {
  await supabase
    .from('comments')
    .insert({
      post_id: postId,
      content,
      author_id: userId,
    })
    .throwOnError();
}

import supabase from '@/db/createClient';

export async function deleteComment(commentId: string) {
  await supabase.from('comments').delete().eq('id', commentId).throwOnError();
}

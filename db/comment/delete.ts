import supabase from '@/db';

export async function deleteCommentFromDB(commentId: string) {
	await supabase.from('comments').delete().eq('id', commentId).throwOnError();
}

import supabase from '@/db';

export async function addEmojiReactionInDB({
	postId,
	userId,
}: {
	postId: string;
	userId: string;
}) {
	try {
		const { data } = await supabase
			.rpc('add_emoji_reaction', {
				p_post_id: postId,
				p_emoji: '👍',
				p_user_id: userId,
			})
			.throwOnError();

		return { success: true, value: data };
	} catch (error) {
		console.error(error);
		return {
			success: false,
			message: error instanceof Error ? error.message : 'Unknown error occurred',
		};
	}
}

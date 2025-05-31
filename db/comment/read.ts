import supabase from '@/db';
import { useTempUserStore } from '@/store/tempUser';
import type { Session } from '@supabase/supabase-js';

export async function getCommentsFromDB(postId: string) {
  const { data: comments } = await supabase
    .rpc('get_comments_with_developer_number', { post_id_param: postId })
    .throwOnError();

  return comments;
}

export const getEmojiCounts = async (
  postId: string,
  session: Session | null | undefined,
) => {
  const userId = session?.user?.id ?? useTempUserStore.getState().getId();

  const { data } = await supabase
    .rpc('get_emoji_counts', {
      p_post_id: postId,
      p_user_id: userId,
    })
    .throwOnError();

  return data;
};

import supabase from '@/db';
import { useTempUserStore } from '@/store/tempUser';
import type { Session } from '@supabase/supabase-js';

export async function addEmojiReactionInDB({
  postId,
  emoji,
  session,
}: {
  postId: string;
  emoji: string;
  session: Session | null | undefined;
}) {
  try {
    const tempId = useTempUserStore.getState().getId();
    const userId = session?.user?.id || tempId;
    const { data } = await supabase
      .rpc('add_emoji_reaction', {
        p_post_id: postId,
        p_emoji: emoji,
        p_user_id: userId,
      })
      .throwOnError();

    return { success: true, value: data };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

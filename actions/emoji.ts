'use server';

import supabase from '@/db';
import { addEmojiReactionInDB } from '@/db/comment/update';
import { getUserId } from '@/utils/auth';
import { getErrMessage } from '@/utils/string';
import type { Session } from '@supabase/supabase-js';
import { headers } from 'next/headers';

export async function addEmojiAction({
  postId,
  emoji,
  session,
}: {
  postId: string;
  emoji: string;
  session: Session | null | undefined;
}) {
  try {
    const userId = await getUserId({ session, headers: await headers() });
    await addEmojiReactionInDB({ postId, emoji, userId });

    return { success: true };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: getErrMessage(error),
    };
  }
}

export const getEmojiCounts = async (
  postId: string,
  session: Session | null | undefined,
) => {
  const userId = await getUserId({ session, headers: await headers() });

  const { data } = await supabase
    .rpc('get_emoji_counts', {
      p_post_id: postId,
      p_user_id: userId,
    })
    .throwOnError();

  return data;
};

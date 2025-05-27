import { getEmojiCounts } from '@/actions/emoji';
import { createCommentInDB } from '@/db/comment/create';
import { deleteCommentFromDB } from '@/db/comment/delete';
import { getCommentsFromDB } from '@/db/comment/read';
import { useSessionStore } from '@/store/session';
import useSWR, { mutate } from 'swr';
import { commentsKey, emojiKey } from './key';

export function useEmojiComment(id: string) {
  const session = useSessionStore((state) => state.session);
  return useSWR([emojiKey(id), session], () => getEmojiCounts(id, session));
}

export const useComments = (id: string) => {
  return useSWR(commentsKey(id), () => getCommentsFromDB(id));
};

export const deleteComment = async (postId: string, commentId: string) => {
  await deleteCommentFromDB(commentId);
  mutate(commentsKey(postId));
};

export const createComment = async (
  id: string,
  content: string,
  profileId: string,
) => {
  await createCommentInDB(id, content, profileId);
  mutate(commentsKey(id));
};

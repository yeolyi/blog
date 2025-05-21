import { createCommentInDB } from '@/db/comment/create';
import { deleteCommentFromDB } from '@/db/comment/delete';
import { getCommentsFromDB, getEmojiReactionsFromDB } from '@/db/comment/read';
import useSWR, { mutate } from 'swr';
import { commentsKey, emojiKey } from './key';

export const useEmojiComment = (id: string) => {
  return useSWR(emojiKey(id), () => getEmojiReactionsFromDB(id));
};

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

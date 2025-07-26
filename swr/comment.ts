import useSWR, { mutate } from 'swr';
import { createCommentInDB } from '@/db/comment/create';
import { deleteCommentFromDB } from '@/db/comment/delete';
import { getCommentsFromDB, getThumbUpUserIds } from '@/db/comment/read';
import { commentsKey, emojiKey as thumbUpKeys } from './key';

export function useThumbUpUserIds(postId: string) {
	return useSWR(thumbUpKeys(postId), () => getThumbUpUserIds(postId));
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

import { createClient } from '@/utils/supabase/server';
import { getTranslations } from 'next-intl/server';
import { Suspense } from 'react';
import { deleteComment, getComments } from '../../../actions';
import { CommentItem } from './Item';

interface CommentListProps {
  postId: string;
}

export default async function CommentViewer({ postId }: CommentListProps) {
  const supabase = await createClient();
  const t = await getTranslations('Comment');

  // 현재 사용자 정보 가져오기
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 댓글 목록 불러오기
  const { comments } = await getComments(postId);

  return (
    <>
      {comments.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">{t('noComments')}</p>
      ) : (
        <Suspense fallback={<div>{t('loading')}</div>}>
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              postId={postId}
              currentUserId={user?.id}
              deleteAction={deleteComment}
            />
          ))}
        </Suspense>
      )}
    </>
  );
}

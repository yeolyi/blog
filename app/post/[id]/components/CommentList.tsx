import { createClient } from '@/utils/supabase/server';
import { deleteComment, getComments } from '../actions';
import { CommentItem } from './CommentItem';

interface CommentListProps {
  postId: string;
}

export default async function CommentList({ postId }: CommentListProps) {
  const supabase = await createClient();

  // 현재 사용자 정보 가져오기
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 댓글 목록 불러오기
  const { comments } = await getComments(postId);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
        댓글 {comments.length > 0 ? `(${comments.length})` : ''}
      </h2>

      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">
            아직 댓글이 없습니다. 첫 댓글을 남겨보세요!
          </p>
        ) : (
          comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              postId={postId}
              currentUserId={user?.id}
              deleteAction={deleteComment}
            />
          ))
        )}
      </div>
    </div>
  );
}

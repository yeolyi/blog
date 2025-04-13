import { createClient } from '@/utils/supabase/server';
import { createComment } from '../actions';
import { CommentFormClient } from './CommentFormClient';

interface CommentFormProps {
  postId: string;
}

export default async function CommentForm({ postId }: CommentFormProps) {
  const supabase = await createClient();

  // 현재 사용자 정보 가져오기
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isLoggedIn = !!user;

  return (
    <div className="mb-8">
      {!isLoggedIn ? (
        <p className="p-4 border border-[#5E5E5E] dark:border-[#5E5E5E] text-gray-700 dark:text-gray-300">
          댓글을 작성하려면 로그인이 필요합니다.
        </p>
      ) : (
        <CommentFormClient postId={postId} createAction={createComment} />
      )}
    </div>
  );
}

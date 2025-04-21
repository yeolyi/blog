import { createClient } from '@/utils/supabase/server';
import { getTranslations } from 'next-intl/server';
import { CommentFormClient } from './CommentFormClient';
import CommentLogin from './CommentLogin';

interface CommentFormProps {
  postId: string;
}

export default async function CommentForm({ postId }: CommentFormProps) {
  const supabase = await createClient();
  const t = await getTranslations('Comment');

  // 현재 사용자 정보 가져오기
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isLoggedIn = !!user;

  return (
    <>
      {!isLoggedIn ? (
        <p className="p-4 border border-[#5E5E5E] dark:border-[#5E5E5E] text-gray-700 dark:text-gray-300">
          {t.rich('loginRequired', {
            loginLink: (chunks) => <CommentLogin>{chunks}</CommentLogin>,
          })}
        </p>
      ) : (
        <CommentFormClient postId={postId} />
      )}
    </>
  );
}

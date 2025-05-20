import { DeleteButton } from '@/components/Comment/DeleteButton';
import { getComments } from '@/db/comment/read';
import type { Profile } from '@/types/helper.types';
import dayjs from 'dayjs';
import { useTranslations } from 'next-intl';
import useSWR from 'swr';

interface CommentListProps {
  postId: string;
  profile: Profile | null;
}

export default function CommentViewer({ postId, profile }: CommentListProps) {
  const headerT = useTranslations('Header');
  const commentT = useTranslations('Comment');

  // TODO
  const { data: comments } = useSWR('comments', () => getComments(postId));
  if (!comments) return null;

  return (
    <>
      {comments.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">
          {commentT('noComments')}
        </p>
      ) : (
        comments.map((comment) => {
          const githubId = comment.github_id;
          const githubUrl = githubId ? `https://github.com/${githubId}` : '#';

          return (
            <div
              key={comment.id}
              className="p-4 border border-[#5E5E5E] dark:border-[#5E5E5E]"
            >
              {/* 게시물에 첨부된 경우 prose가 적용되지 않도록 처리 */}
              <div className="not-prose flex justify-between items-start mb-4">
                <p>
                  <a
                    href={githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-gray-700 hover:underline dark:text-gray-300"
                  >
                    {headerT('developer', { number: comment.developernumber })}
                  </a>
                  <span className="text-xs text-gray-500 mt-2 whitespace-pre">
                    {`  ${dayjs(comment.created_at).format(commentT('dateFormat'))}`}
                  </span>
                </p>
                {profile?.id === comment.author_id && (
                  <DeleteButton commentId={comment.id} />
                )}
              </div>
              <p className="text-gray-300 break-keep">{comment.content}</p>
            </div>
          );
        })
      )}
    </>
  );
}

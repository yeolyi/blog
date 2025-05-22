import Button from '@/components/ui/Button';
import { border } from '@/components/ui/theme';
import { useProfile } from '@/swr/auth';
import { deleteComment, useComments } from '@/swr/comment';
import type { Comment } from '@/types/helper.types';
import dayjs from 'dayjs';
import { Check, Trash, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

interface CommentListProps {
  postId: string;
}

export default function CommentList({ postId }: CommentListProps) {
  const { data: comments } = useComments(postId);

  return (
    <>
      {comments?.map((comment) => (
        <CommentItem key={comment.id} comment={comment} postId={postId} />
      ))}
    </>
  );
}

const CommentItem = ({
  comment,
  postId,
}: {
  comment: Comment;
  postId: string;
}) => {
  const headerT = useTranslations('Header');
  const commentT = useTranslations('Comment');
  const { data: profile } = useProfile();

  const githubId = comment.github_id;
  const githubUrl = githubId ? `https://github.com/${githubId}` : '#';
  const isAuthor = profile?.id === comment.author_id;

  return (
    <div key={comment.id} className={`p-4 ${border}`}>
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
        {isAuthor && <DeleteButton postId={postId} commentId={comment.id} />}
      </div>
      <p className="text-gray-300 break-keep">{comment.content}</p>
    </div>
  );
};

const DeleteButton = ({
  postId,
  commentId,
}: {
  postId: string;
  commentId: string;
}) => {
  const [asked, setAsked] = useState(false);

  if (asked) {
    return (
      <div className="flex -m-4">
        <Button
          type="button"
          onClick={() => deleteComment(postId, commentId)}
          bg="transparent"
          Icon={Check}
        />
        <Button
          type="button"
          onClick={() => setAsked(false)}
          bg="transparent"
          Icon={X}
        />
      </div>
    );
  }

  return (
    <Button
      type="button"
      onClick={() => setAsked(true)}
      bg="transparent"
      Icon={Trash}
      className="-m-4"
    />
  );
};

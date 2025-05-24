import Button from '@/components/ui/Button';
import { layerBg } from '@/components/ui/theme';
import { Link } from '@/i18n/navigation';
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
    <div
      className={`relative prose prose-invert prose-stone prose-p:m-0 prose-a:no-underline ${layerBg} p-4 min-w-full`}
    >
      <p key={comment.id}>
        <Link href={githubUrl} target="_blank" rel="noopener noreferrer">
          {headerT('developer', { number: comment.developernumber })}
        </Link>

        <code className="text-stone-400">
          {`  ${dayjs(comment.created_at).format(commentT('dateFormat'))}`}
        </code>

        <br />

        {comment.content}
      </p>
      {isAuthor && <DeleteButton postId={postId} commentId={comment.id} />}
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
      <div className="flex absolute top-0 right-0">
        <Button
          type="button"
          onClick={() => setAsked(false)}
          bg="transparent"
          Icon={X}
        />
        <Button
          type="button"
          onClick={() => deleteComment(postId, commentId)}
          bg="transparent"
          Icon={Check}
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
      className="absolute top-0 right-0"
    />
  );
};

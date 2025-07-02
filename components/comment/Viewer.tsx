import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
    <Card className="relative">
      <CardContent>
        <div className="mb-2">
          <Link href={githubUrl} target="_blank" rel="noopener noreferrer">
            {headerT('developer', { number: comment.developernumber })}
          </Link>

          <code className="text-sm text-muted-foreground mb-2">
            {`  ${dayjs(comment.created_at).format(commentT('dateFormat'))}`}
          </code>
        </div>

        {comment.content}
        {isAuthor && <DeleteButton postId={postId} commentId={comment.id} />}
      </CardContent>
    </Card>
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
          size="icon"
          variant="ghost"
        >
          <X />
        </Button>
        <Button
          type="button"
          onClick={() => deleteComment(postId, commentId)}
          size="icon"
          variant="ghost"
        >
          <Check />
        </Button>
      </div>
    );
  }

  return (
    <Button
      type="button"
      onClick={() => setAsked(true)}
      variant="ghost"
      size="icon"
      className="absolute top-0 right-0"
    >
      <Trash />
    </Button>
  );
};

import { Suspense } from 'react';
import CommentForm from './CommentForm';
import CommentList from './CommentList';
import {
  EmojiReactionsList,
  EmojiResponseFallback,
} from './EmojiReactionsList';

interface CommentsProps {
  postId: string;
}

export default function Comments({ postId }: CommentsProps) {
  return (
    <div className="space-y-4">
      <Suspense fallback={<EmojiResponseFallback />}>
        <EmojiReactionsList postId={postId} />
      </Suspense>

      <Suspense>
        <CommentForm postId={postId} />
      </Suspense>

      <Suspense>
        <CommentList postId={postId} />
      </Suspense>
    </div>
  );
}

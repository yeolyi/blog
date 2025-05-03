import { getIsAuthenticated } from '@/utils/auth';
import { Suspense } from 'react';
import Emoji from './Emoji';
import CommentForm from './Form/CommentForm';
import CommentViewer from './Viewer';

export default async function Comment({ postId }: { postId: string }) {
  const isLoggedIn = await getIsAuthenticated();

  return (
    <div className="space-y-4">
      <Suspense fallback={<Emoji.Fallback />}>
        <Emoji postId={postId} />
      </Suspense>

      <Suspense>
        <CommentForm postId={postId} isLoggedIn={isLoggedIn} />
      </Suspense>

      <Suspense>
        <CommentViewer postId={postId} />
      </Suspense>
    </div>
  );
}

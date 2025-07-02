'use client';
import NeedLogin from '@/components/comment/NeedLogin';
import { useSessionStore } from '@/store/session';
import Emoji from './Emoji';
import CommentForm from './Form';
import CommentList from './Viewer';

export default function Comment({ postId }: { postId: string }) {
  const session = useSessionStore((state) => state.session);

  return (
    // max-w- 좀 예쁘게...
    <div className="w-full space-y-4 max-w-prose">
      <Emoji postId={postId} />
      {session ? <CommentForm postId={postId} /> : <NeedLogin />}
      <CommentList postId={postId} />
    </div>
  );
}

'use client';

import { useProfileStore } from '@/store/profile';
import Emoji from './Emoji';
import CommentForm from './Form';
import CommentViewer from './Viewer';

export default function Comment({ postId }: { postId: string }) {
  const { profile } = useProfileStore();

  return (
    <div className="space-y-4">
      <Emoji postId={postId} profile={profile} />
      <CommentForm postId={postId} profile={profile} />
      <CommentViewer postId={postId} profile={profile} />
    </div>
  );
}

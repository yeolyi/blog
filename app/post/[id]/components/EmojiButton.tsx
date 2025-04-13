'use client';

import { toggleEmojiReaction } from '@/app/post/[id]/actions';

export default function EmojiButton({
  emoji,
  count,
  postId,
  userReacted,
}: {
  emoji: string;
  count: number;
  postId: string;
  userReacted: boolean;
}) {
  return (
    <button
      className={`flex items-center border border-[#5E5E5E] px-2 py-1 cursor-pointer hover:bg-white hover:text-black text-white ${
        userReacted ? 'bg-zinc-700' : ''
      }`}
      type="button"
      onClick={() => toggleEmojiReaction({ postId, emoji })}
    >
      <span className="text-xl mr-1">{emoji}</span>
      <span className="text-sm">{count}</span>
    </button>
  );
}

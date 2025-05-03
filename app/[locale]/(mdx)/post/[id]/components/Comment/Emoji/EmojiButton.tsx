'use client';

import { toggleEmojiReaction } from '@/app/[locale]/(mdx)/post/[id]/actions';

type EmojiButtonProps = {
  emoji: string;
  count: number;
  postId: string;
  userReacted: boolean;
  isAuthenticated: boolean;
};

export default function EmojiButton({
  emoji,
  count,
  postId,
  userReacted,
  isAuthenticated,
}: EmojiButtonProps) {
  return (
    <button
      className={`flex items-center border border-[#5E5E5E] px-2 py-1 hover:bg-white hover:text-black text-white ${
        userReacted ? 'bg-zinc-700' : ''
      } ${!isAuthenticated ? 'cursor-not-allowed' : 'cursor-pointer'}`}
      type="button"
      onClick={() => isAuthenticated && toggleEmojiReaction({ postId, emoji })}
    >
      <span className="text-xl mr-1">{emoji}</span>
      <span className="text-sm">{count}</span>
    </button>
  );
}

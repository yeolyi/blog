import { getEmojiReactions } from '@/db/comment/read';
import { toggleEmojiReaction } from '@/db/comment/update';
import type { Profile } from '@/types/helper.types';
import useSWR from 'swr';

export default function Emoji({
  postId,
  profile,
}: {
  postId: string;
  profile: Profile | null;
}) {
  const { data: _reactions, mutate } = useSWR(postId, getEmojiReactions);
  const isAuthenticated = !!profile;

  if (!_reactions) return null;

  const reactions = [
    ..._reactions,
    ...(_reactions.find((reaction) => reaction.emoji === '👍')
      ? []
      : [{ emoji: '👍', count: 0, user_reacted: false }]),
  ].sort((a, b) => b.count - a.count);

  const onClick = async (emoji: string) => {
    await toggleEmojiReaction({ postId, emoji });
    mutate();
  };

  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {reactions.map(({ emoji, count, user_reacted }) => (
        <button
          key={emoji}
          className={`flex items-center border border-[#5E5E5E] px-2 py-1 hover:bg-white hover:text-black text-white ${
            user_reacted ? 'bg-zinc-700' : ''
          } ${!isAuthenticated ? 'cursor-not-allowed' : 'cursor-pointer'}`}
          type="button"
          onClick={() => onClick(emoji)}
        >
          <span className="text-xl mr-1">{emoji}</span>
          <span className="text-sm">{count}</span>
        </button>
      ))}
    </div>
  );
}

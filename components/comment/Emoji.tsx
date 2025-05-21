import { toggleEmojiReactionInDB } from '@/db/comment/update';
import { useSessionStore } from '@/store/session';
import { useEmojiComment } from '@/swr/comment';
import clsx from 'clsx';

const DEFAULT_EMOJIS = ['👍', '🔥'];

export default function Emoji({ postId }: { postId: string }) {
  const session = useSessionStore((state) => state.session);
  const { data, mutate } = useEmojiComment(postId);

  const emojiMap = new Map(
    DEFAULT_EMOJIS.map((emoji) => [emoji, { count: 0, user_reacted: false }]),
  );
  for (const reaction of data ?? []) {
    emojiMap.set(reaction.emoji, reaction);
  }

  const onClick = async (emoji: string) => {
    await toggleEmojiReactionInDB({ postId, emoji });
    await mutate();
  };

  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {Array.from(emojiMap.entries()).map(
        ([emoji, { count, user_reacted }]) => (
          <button
            key={emoji}
            className={clsx(
              'flex items-center border px-2 py-1 hover:opacity-80 text-white active:opacity-60 bg-stone-700',
              user_reacted ? 'border-stone-500' : 'border-transparent',
              session ? 'cursor-pointer' : 'cursor-not-allowed',
            )}
            type="button"
            onClick={() => onClick(emoji)}
            disabled={!session}
          >
            <span className="text-xl mr-1">{emoji}</span>
            <span className="text-sm">{count}</span>
          </button>
        ),
      )}
    </div>
  );
}

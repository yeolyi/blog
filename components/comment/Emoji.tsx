import { bgMap } from '@/components/ui/theme';
import { toggleEmojiReactionInDB } from '@/db/comment/update';
import { useSessionStore } from '@/store/session';
import { useEmojiComment } from '@/swr/comment';
import { confetti } from '@/utils/confetti';
import clsx from 'clsx';
import Image from 'next/image';
import clap from './assets/clap.webp';
import heart from './assets/heart.webp';
import party from './assets/party.webp';
import rocket from './assets/rocket.webp';
import sparkles from './assets/sparkles.webp';
const DEFAULT_EMOJIS = ['👍', '❤️', '🎉', '✨', '🚀'] as const;
const EMOJI_TO_ANIMATED = {
  // thumb_up이 못생겨서 대체
  '👍': clap,
  '❤️': heart,
  '🎉': party,
  '✨': sparkles,
  '🚀': rocket,
};

export default function Emoji({ postId }: { postId: string }) {
  const session = useSessionStore((state) => state.session);
  const { data, mutate } = useEmojiComment(postId);

  const reactionArr = DEFAULT_EMOJIS.map((emoji) => {
    const reaction = data?.find((reaction) => reaction.emoji === emoji);
    return {
      emoji,
      count: reaction?.count ?? 0,
      user_reacted: reaction?.user_reacted ?? false,
    };
  });

  const getReaction = (emoji: string) =>
    reactionArr.find((reaction) => reaction.emoji === emoji);

  const onClick = async (emoji: string) => {
    await toggleEmojiReactionInDB({ postId, emoji });
    await mutate();

    const isUserReacted = getReaction(emoji)?.user_reacted;
    if (isUserReacted) return;

    confetti(100);
  };

  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {reactionArr.map(({ emoji, count, user_reacted }) => (
        <button
          key={emoji}
          className={clsx(
            'flex items-center gap-2  text-white px-2 py-1',
            session ? 'cursor-pointer' : 'cursor-not-allowed',
            bgMap.gray,
            user_reacted ? 'font-semibold' : 'font-normal',
          )}
          type="button"
          onClick={() => onClick(emoji)}
          disabled={!session}
        >
          <Image
            src={EMOJI_TO_ANIMATED[emoji]}
            // 미세조정
            className={emoji === '🎉' ? '-translate-y-1' : ''}
            alt={emoji}
            width={25}
            height={25}
          />
          <span className="text-sm">{count}</span>
        </button>
      ))}
    </div>
  );
}

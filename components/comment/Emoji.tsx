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
const EMOJI_TO_COLOR = {
  '👍': ['#FFD700', '#FFEB3B', '#FFF176', '#FBC02D', '#F57F17', '#FFF9C4'],
  '❤️': ['#FF4081', '#F06292', '#E91E63', '#FF8A80', '#F50057', '#FFF1F3'],
  '🎉': undefined,
  '✨': ['#FFF176', '#FFF59D', '#FFEB3B', '#FDD835', '#FFFDE7', '#FFD600'],
  '🚀': ['#F44336', '#2196F3', '#90CAF9', '#FF7043', '#B0BEC5', '#ECEFF1'],
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

  const onClick =
    (emoji: string) => async (e: React.MouseEvent<HTMLButtonElement>) => {
      // 1. await 이후 React가 리렌더링하며 이벤트 핸들러와 관련된 DOM이 제거되었을 가능성 있음.
      // 2. 이벤트 풀링: React는 SyntheticEvent(합성 이벤트)를 사용합니다.
      // 이건 브라우저의 Native Event를 감싸서 크로스 브라우징 이슈를 줄이고 성능을 개선하기 위한 방식입니다.
      const target = e.currentTarget;
      const rect = target.getBoundingClientRect();

      await toggleEmojiReactionInDB({ postId, emoji });
      await mutate();

      const isUserReacted = getReaction(emoji)?.user_reacted;
      if (isUserReacted) return;

      const x = (rect.x + rect.width / 2) / window.innerWidth;
      const y = (rect.y + rect.height / 2) / window.innerHeight;

      confetti({ origin: { x, y }, colors: EMOJI_TO_COLOR[emoji] });
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
          onClick={onClick(emoji)}
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

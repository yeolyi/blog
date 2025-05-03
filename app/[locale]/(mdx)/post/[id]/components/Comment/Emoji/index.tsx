import EmojiButton from '@/app/[locale]/(mdx)/post/[id]/components/Comment/Emoji/EmojiButton';
import { getIsAuthenticated } from '@/utils/auth';
import { getEmojiReactions } from '../../../actions';

interface EmojiReactionsListProps {
  postId: string;
}

export async function Emoji({ postId }: EmojiReactionsListProps) {
  try {
    const isAuthenticated = await getIsAuthenticated();

    // 이모지 반응 데이터 가져오기
    const emojiReactions = await getEmojiReactions(postId);

    const defaultEmojis = ['👍'];
    for (const emoji of defaultEmojis) {
      if (!emojiReactions.find((reaction) => reaction.emoji === emoji)) {
        emojiReactions.push({ emoji, count: 0, user_reacted: false });
      }
    }

    const sortedEmojis = emojiReactions.sort((a, b) => b.count - a.count);

    return (
      <div className="flex flex-wrap gap-2 mt-2">
        {sortedEmojis.map(({ emoji, count, user_reacted }) => (
          <EmojiButton
            key={emoji}
            emoji={emoji}
            count={count}
            postId={postId}
            userReacted={user_reacted}
            isAuthenticated={isAuthenticated}
          />
        ))}
      </div>
    );
  } catch (error) {
    console.error('이모지 반응 목록 렌더링 오류:', error);
    return (
      <div className="text-sm text-red-500">
        이모지 반응을 불러오는 중 오류가 발생했습니다.
      </div>
    );
  }
}

const EmojiResponseFallback = () => {
  return (
    <div className="flex flex-wrap gap-2 mt-2">
      <EmojiButton
        emoji="👍"
        count={0}
        postId=""
        userReacted={false}
        isAuthenticated={false}
      />
    </div>
  );
};

export default Object.assign(Emoji, {
  Fallback: EmojiResponseFallback,
});

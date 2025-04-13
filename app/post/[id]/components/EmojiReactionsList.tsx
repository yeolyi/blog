import AddEmojiButton from '@/app/post/[id]/components/AddEmojiButton';
import EmojiButton from '@/app/post/[id]/components/EmojiButton';
import React from 'react';
import { getEmojiReactions } from '../actions';

interface EmojiReactionsListProps {
  postId: string;
}

export async function EmojiReactionsList({ postId }: EmojiReactionsListProps) {
  try {
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
          />
        ))}
        <AddEmojiButton />
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

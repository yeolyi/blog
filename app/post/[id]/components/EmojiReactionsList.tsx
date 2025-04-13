import React from 'react';
import { getEmojiReactions } from '../actions';

interface EmojiReactionsListProps {
  postId: string;
}

export async function EmojiReactionsList({ postId }: EmojiReactionsListProps) {
  try {
    // 이모지 반응 데이터 가져오기
    const emojiCounts = await getEmojiReactions(postId);

    // 이모지가 없으면 아무것도 표시하지 않음
    if (!emojiCounts || Object.keys(emojiCounts).length === 0) {
      return null;
    }

    return (
      <div className="flex flex-wrap gap-2 mt-2">
        {Object.entries(emojiCounts).map(([emoji, count]) => (
          <EmojiButton key={emoji} emoji={emoji} count={count} />
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

const EmojiButton = ({ emoji, count }: { emoji: string; count: number }) => {
  return (
    <button
      className="flex items-center border border-[#5E5E5E] px-2 py-1 cursor-pointer hover:bg-white hover:text-black text-white"
      type="button"
    >
      <span className="text-xl mr-1">{emoji}</span>
      <span className="text-sm">{count}</span>
    </button>
  );
};

const AddEmojiButton = () => {
  return (
    <button
      className="flex items-center border border-[#5E5E5E] px-2 py-1 cursor-pointer hover:bg-white hover:text-black text-white"
      type="button"
    >
      <span className="text-xl">+</span>
    </button>
  );
};

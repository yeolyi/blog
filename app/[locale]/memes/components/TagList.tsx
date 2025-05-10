'use client';

import type { Meme } from '@/types/meme';

interface TagListProps {
  tags: Meme['meme_tags'];
}

export default function TagList({ tags }: TagListProps) {
  return (
    <div className="flex flex-wrap gap-3">
      {tags.length > 0 ? (
        tags.map((tag) => (
          <span
            key={tag.tag_id}
            className="bg-white text-black py-2 px-4 text-sm font-medium"
          >
            {tag.tags.name}
          </span>
        ))
      ) : (
        <span className="text-[#aaaaaa] italic">태그 없음</span>
      )}
    </div>
  );
}

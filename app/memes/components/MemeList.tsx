"use client";

import { useState } from "react";
import { MemeItem } from "./MenuItem";
export interface Tag {
  id: string;
  name: string;
}

export interface MemeTag {
  tag_id: string;
  tags: Tag;
}

export interface Meme {
  id: string;
  title: string;
  description: string | null;
  media_url: string;
  created_at: string;
  meme_tags: MemeTag[];
}

interface MemeListProps {
  memes: Meme[];
}

export default function MemeList({ memes }: MemeListProps) {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // 모든 태그 추출 (중복 제거)
  const allTags = Array.from(
    new Set(memes.flatMap((meme) => meme.meme_tags.map((mt) => mt.tags.name)))
  ).sort();

  // 태그로 필터링
  const filteredMemes = selectedTag
    ? memes.filter((meme) =>
        meme.meme_tags.some((mt) => mt.tags.name === selectedTag)
      )
    : memes;

  return (
    <div>
      <div>
        <div>
          <span>태그 필터링:</span>
          <button onClick={() => setSelectedTag(null)}>전체</button>
          {allTags.map((tag) => (
            <button key={tag} onClick={() => setSelectedTag(tag)}>
              {tag}
            </button>
          ))}
        </div>
      </div>

      {filteredMemes.length === 0 ? (
        <div>
          <p>표시할 밈이 없습니다</p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "1rem",
          }}
        >
          {filteredMemes.map((meme) => (
            <MemeItem key={meme.id} meme={meme} />
          ))}
        </div>
      )}
    </div>
  );
}

'use client';

import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import type { Meme, Tag } from '@/types/meme';
import { useCallback, useState } from 'react';
import { getMemes } from '../actions';
import { MemeItem } from './MenuItem';

interface MemeListProps {
  memes: Meme[];
  allTags: Tag[];
}

export default function MemeList({
  memes: initialMemes,
  allTags,
}: MemeListProps) {
  const [memes, setMemes] = useState<Meme[]>(initialMemes);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [selectedTag, setSelectedTag] = useState<string | undefined>(undefined);

  const changeTag = useCallback(
    (tag?: string) => {
      if (loading) return;
      setSelectedTag(tag);
      setMemes([]);
      setPage(1);
      setHasMore(true);
      setLoading(true);

      const fetchMemes = async () => {
        const result = await getMemes(tag, 1);
        setMemes(result.data);
        setLoading(false);
      };

      fetchMemes();

      return () => {
        setLoading(false);
      };
    },
    [loading],
  );

  // 추가 밈 로드 함수
  const loadMoreMemes = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const nextPage = page + 1;
      const result = await getMemes(selectedTag, nextPage);

      if (result.data.length === 0) {
        setHasMore(false);
      } else {
        setMemes((prev) => [...prev, ...result.data]);
        setPage(nextPage);
      }
    } catch (error) {
      console.error('밈 추가 로딩 오류:', error);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, page, selectedTag]);

  // 무한 스크롤 훅 사용
  const { setLastItemRef } = useInfiniteScroll({
    loading,
    hasMore,
    onIntersect: loadMoreMemes,
  });

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap gap-3 items-center">
        <button
          type="button"
          onClick={() => changeTag(undefined)}
          className={`text-decoration-none py-2 px-4 bg-transparent border border-[#5e5e5e] text-[#e0e0e0] cursor-pointer hover:bg-white hover:text-black ${!selectedTag ? 'bg-white text-black border-white' : ''}`}
        >
          전체
        </button>
        {allTags.map((tag) => (
          <button
            type="button"
            key={tag.id}
            onClick={() => changeTag(tag.name)}
            className={`text-decoration-none py-2 px-4 bg-transparent border border-[#5e5e5e] text-[#e0e0e0] cursor-pointer hover:bg-white hover:text-black ${selectedTag === tag.name ? 'bg-white text-black border-white' : ''}`}
          >
            {tag.name}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-6">
        {memes.map((meme, index) => (
          <MemeItem
            meme={meme}
            key={meme.id}
            ref={index === memes.length - 1 ? setLastItemRef : null}
          />
        ))}
        {loading && (
          <div className="text-center py-8 text-xl text-[#e0e0e0] w-full">
            로딩 중...
          </div>
        )}
      </div>
    </div>
  );
}

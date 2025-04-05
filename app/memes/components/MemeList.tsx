"use client";

import { usePathname } from "next/navigation";
import { MemeItem } from "./MenuItem";
import Link from "next/link";
import { useCallback, useState } from "react";
import { getMemes } from "../actions";
import { Meme, Tag } from "@/types/meme";
import { useInfiniteScroll } from "@/utils/useInfiniteScroll";

interface MemeListProps {
  memes: Meme[];
  isAdmin: boolean;
  allTags: Tag[];
  selectedTag?: string;
}

export default function MemeList({
  memes: initialMemes,
  isAdmin,
  allTags,
  selectedTag,
}: MemeListProps) {
  const pathname = usePathname();
  const [memes, setMemes] = useState<Meme[]>(initialMemes);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

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
      console.error("밈 추가 로딩 오류:", error);
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
    <div>
      <div>
        <div>
          <span>태그 필터링:</span>
          <Link href={pathname}>
            <button className={selectedTag ? "" : "selected"}>전체</button>
          </Link>
          {allTags.map((tag) => (
            <Link
              key={tag.id}
              href={`${pathname}?tag=${encodeURIComponent(tag.name)}`}
            >
              <button className={selectedTag === tag.name ? "selected" : ""}>
                {tag.name}
              </button>
            </Link>
          ))}
        </div>
      </div>

      {memes.length === 0 ? (
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
          {memes.map((meme, index) => (
            <div
              key={meme.id}
              ref={index === memes.length - 1 ? setLastItemRef : null}
            >
              <MemeItem meme={meme} isAdmin={isAdmin} />
            </div>
          ))}
          {loading && <div>로딩 중...</div>}
        </div>
      )}
    </div>
  );
}

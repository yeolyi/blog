"use client";

import { usePathname } from "next/navigation";
import { MemeItem } from "./MenuItem";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { getMemes } from "../actions";

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
  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastMemeRef = useRef<HTMLDivElement | null>(null);

  // 처음 로드 시 초기 데이터 설정
  useEffect(() => {
    setMemes(initialMemes);
    setPage(1);
    setHasMore(true);
  }, [initialMemes, selectedTag]);

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

  // 인터섹션 옵저버 설정
  useEffect(() => {
    if (loading) return;

    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    const callback = async (entries: IntersectionObserverEntry[]) => {
      if (entries[0].isIntersecting && hasMore) {
        await loadMoreMemes();
      }
    };

    observerRef.current = new IntersectionObserver(callback, {
      rootMargin: "100px",
    });

    if (lastMemeRef.current) {
      observerRef.current.observe(lastMemeRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [loading, hasMore, loadMoreMemes]);

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
              ref={index === memes.length - 1 ? lastMemeRef : null}
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

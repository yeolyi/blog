"use client";

import { MemeItem } from "./MenuItem";
import { useCallback, useState } from "react";
import { getMemes } from "../actions";
import { Meme, Tag } from "@/types/meme";
import { useInfiniteScroll } from "@/utils/useInfiniteScroll";
import { styled } from "@pigment-css/react";

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

  const changeTag = useCallback((tag?: string) => {
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
  }, [loading]);

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
    <Container>
      <TagFilterContainer>
        <TagButton onClick={() => changeTag(undefined)} className={selectedTag ? "" : "selected"}>
          전체
        </TagButton>
        {allTags.map((tag) => (
          <TagButton
            key={tag.id}
            onClick={() => changeTag(tag.name)}
            className={selectedTag === tag.name ? "selected" : ""}
          >
            {tag.name}
          </TagButton>
        ))}
      </TagFilterContainer>

      <MemeGrid>
        {memes.map((meme, index) => (
          <MemeItem
            meme={meme}
            key={meme.id}
            ref={index === memes.length - 1 ? setLastItemRef : null}
          />
        ))}
        {loading && <LoadingText>로딩 중...</LoadingText>}
      </MemeGrid>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const TagFilterContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
  align-items: center;
`;

const TagButton = styled.button`
  text-decoration: none;
  padding: 0.5rem 1rem;
  background-color: transparent;
  border: 1px solid #5e5e5e;
  color: #e0e0e0;
  cursor: pointer;

  &:hover {
    background-color: white;
    color: black;
  }

  &.selected {
    background-color: white;
    color: black;
    border-color: white;
  }
`;

const MemeGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
`;

const LoadingText = styled.div`
  grid-column: 1 / -1;
  text-align: center;
  padding: 2rem;
  font-size: 1.2rem;
  color: #e0e0e0;
`;

'use client';
import type { Meme, Tag } from '@/types/meme';
import { type MasonryProps, useInfiniteLoader } from 'masonic';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { type ComponentType, useCallback, useState } from 'react';
import { getMemes } from '../actions';
import MemeEditForm from './MemeEditForm';
import MemeModal from './MemeModal';

const Masonry: ComponentType<MasonryProps<Meme>> = dynamic(
  () => import('masonic').then((mod) => mod.Masonry),
  { ssr: false },
);

interface MemeListProps {
  memes: Meme[];
  allTags: Tag[];
  isAdmin?: boolean;
}

export default function MemeList({
  memes: initialMemes,
  allTags,
  isAdmin = false,
}: MemeListProps) {
  const [memes, setMemes] = useState<Meme[]>(initialMemes);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [selectedTag, setSelectedTag] = useState<string | undefined>(undefined);
  const [selectedMeme, setSelectedMeme] = useState<Meme | null>(null);
  const router = useRouter();

  const changeTag = useCallback(
    (tag?: string) => {
      if (loading) return;
      setSelectedTag(tag);
      setMemes([]);
      setPage(1);
      setHasMore(true);
      setLoading(true);
      setSelectedMeme(null);

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

  const maybeLoadMore = useInfiniteLoader(loadMoreMemes, {
    isItemLoaded: (index, items) => !!items[index],
    minimumBatchSize: 1,
    threshold: 3,
  });

  const handleMemeClick = (meme: Meme) => {
    console.log(meme);
    setSelectedMeme(meme);
  };

  const handleFormSuccess = () => {
    setSelectedMeme(null);
  };

  const handleModalOpenChange = (open: boolean) => {
    if (!open) {
      setSelectedMeme(null);
    }
  };

  const isModalOpen = selectedMeme !== null;

  return (
    <div className="flex flex-col gap-8 w-full">
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

      <Masonry
        key={selectedTag}
        itemKey={(item) => item.id}
        items={memes}
        columnGutter={16}
        columnWidth={300}
        render={({ data: meme }) => (
          <div className="no-underline hover:-translate-y-1 block">
            <button
              type="button"
              onClick={() => handleMemeClick(meme)}
              className="cursor-pointer border-0 p-0 bg-transparent w-full"
            >
              <img src={meme.media_url} alt={meme.title} className="w-full" />
            </button>
          </div>
        )}
        onRender={maybeLoadMore}
      />

      <MemeModal
        isOpen={isModalOpen}
        onOpenChange={handleModalOpenChange}
        title="밈 수정"
      >
        {selectedMeme && (
          <div className="flex flex-col gap-6">
            <MemeEditForm
              meme={selectedMeme}
              onSuccess={handleFormSuccess}
              onCancel={() => setSelectedMeme(null)}
            />
          </div>
        )}
      </MemeModal>

      {loading && (
        <div className="text-center py-8 text-xl text-[#e0e0e0] w-full">
          로딩 중...
        </div>
      )}
    </div>
  );
}

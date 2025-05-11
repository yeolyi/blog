'use client';
import { useMemeStore } from '@/app/store/memeStore';
import type { Meme, Tag } from '@/types/meme';
import { Check, X } from 'lucide-react';
import { type MasonryProps, useInfiniteLoader } from 'masonic';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { type ComponentType, useCallback, useEffect, useMemo } from 'react';
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
  const router = useRouter();
  const {
    memes,
    loading,
    hasMore,
    selectedTag,
    selectedMeme,
    setMemes,
    setAllTags,
    loadMoreMemes,
    changeTag,
    setSelectedMeme,
  } = useMemeStore();

  // 초기 데이터 설정
  useEffect(() => {
    setMemes(initialMemes);
    setAllTags(allTags);
  }, [initialMemes, allTags, setMemes, setAllTags]);

  // meme 아이템마다 고유한 키 생성
  const uniqueMemesKey = useMemo(() => {
    return memes.length > 0
      ? `memes-${selectedTag || 'all'}-${Date.now()}`
      : 'empty-memes';
  }, [memes.length, selectedTag]);

  const maybeLoadMore = useInfiniteLoader(loadMoreMemes, {
    isItemLoaded: (index, items) => !!items[index],
    minimumBatchSize: 1,
    threshold: 3,
  });

  const handleMemeClick = useCallback(
    (meme: Meme) => {
      setSelectedMeme(meme);
    },
    [setSelectedMeme],
  );

  const handleFormSuccess = useCallback(() => {
    setSelectedMeme(null);
  }, [setSelectedMeme]);

  const handleModalOpenChange = useCallback(
    (open: boolean) => {
      if (!open) {
        setSelectedMeme(null);
      }
    },
    [setSelectedMeme],
  );

  const isModalOpen = selectedMeme !== null;

  const handleTagChange = useCallback(
    (tag?: string) => {
      changeTag(tag);
    },
    [changeTag],
  );

  return (
    <div className="flex flex-col gap-8 w-full">
      <div className="flex flex-wrap gap-3 items-center">
        <button
          type="button"
          onClick={() => handleTagChange('확인안함')}
          className={`text-decoration-none py-2 px-4 flex items-center gap-1 bg-transparent border border-[#f44336] text-[#f44336] rounded-full cursor-pointer hover:bg-[#f44336] hover:text-white ${selectedTag === '확인안함' ? 'bg-[#f44336] text-white' : ''}`}
        >
          <X size={16} /> 확인안함
        </button>
        <button
          type="button"
          onClick={() => handleTagChange('확인함')}
          className={`text-decoration-none py-2 px-4 flex items-center gap-1 bg-transparent border border-[#4CAF50] text-[#4CAF50] rounded-full cursor-pointer hover:bg-[#4CAF50] hover:text-white ${selectedTag === '확인함' ? 'bg-[#4CAF50] text-white' : ''}`}
        >
          <Check size={16} /> 확인함
        </button>
        {allTags.map((tag) => (
          <button
            type="button"
            key={tag.id}
            onClick={() => handleTagChange(tag.name)}
            className={`text-decoration-none py-2 px-4 bg-transparent border border-[#5e5e5e] text-[#e0e0e0] cursor-pointer hover:bg-white hover:text-black ${selectedTag === tag.name ? 'bg-white text-black border-white' : ''}`}
          >
            {tag.name}
          </button>
        ))}
      </div>

      <Masonry
        key={uniqueMemesKey}
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

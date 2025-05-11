'use client';
import { useMemeStore } from '@/app/[locale]/memes/store/memeStore';
import type { Meme, Tag } from '@/types/meme';
import { Eye, Shuffle } from 'lucide-react';
import type { MasonryProps } from 'masonic';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { type ComponentType, useCallback, useEffect } from 'react';
import MemeEditForm from './MemeEditForm';
import MemeModal from './MemeModal';

const Masonry: ComponentType<MasonryProps<Meme>> = dynamic(
  () => import('masonic').then((mod) => mod.Masonry),
  { ssr: false },
);

interface MemeListProps {
  memes: Meme[];
  allTags: Tag[];
}

export default function MemeList({
  memes: initialMemes,
  allTags,
}: MemeListProps) {
  const {
    key,
    displayedMemes,
    selectedTag,
    selectedMeme,
    isHiddenMode,
    initialize,
    shuffleMemes,
    changeTag,
    setSelectedMeme,
    showHiddenMemes,
  } = useMemeStore();

  // 초기 데이터 설정 및 밈 로드
  // biome-ignore lint/correctness/useExhaustiveDependencies: TODO
  useEffect(() => {
    initialize(initialMemes, allTags);
  }, []);

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

  return (
    <div className="flex flex-col gap-8 w-full">
      <div className="flex flex-wrap gap-3 items-center">
        <button
          type="button"
          onClick={shuffleMemes}
          className="text-decoration-none py-2 px-4 flex items-center gap-1 bg-transparent border border-[#9c27b0] text-[#9c27b0] rounded-full cursor-pointer hover:bg-[#9c27b0] hover:text-white"
        >
          <Shuffle size={16} /> 셔플
        </button>
        <button
          type="button"
          onClick={showHiddenMemes}
          className={`flex items-center gap-1 text-decoration-none py-2 px-4 bg-transparent border border-[#5e5e5e] text-[#e0e0e0] cursor-pointer hover:bg-white hover:text-black ${isHiddenMode ? 'bg-white text-black border-white' : ''}`}
        >
          <Eye size={16} /> 숨김 보기
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
        key={key}
        itemKey={(item) => item.id}
        items={displayedMemes}
        columnGutter={16}
        columnWidth={300}
        render={({ data: meme }) => (
          <div className="no-underline hover:-translate-y-1 block border border-white/50">
            <button
              type="button"
              onClick={() => handleMemeClick(meme)}
              className="cursor-pointer border-0 p-0 bg-transparent w-full"
            >
              <Image
                width={meme.width}
                height={meme.height}
                src={meme.media_url}
                alt={meme.title}
                className="w-full"
              />
            </button>
          </div>
        )}
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
    </div>
  );
}

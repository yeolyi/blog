'use client';
import {
  allTagsAtom,
  changeTagAtom,
  displayedMemesAtom,
  isHiddenModeAtom,
  keyAtom,
  memesAtom,
  selectedIdAtom,
  selectedTagAtom,
  shuffleMemesAtom,
  toggleHiddenMemesAtom,
} from '@/app/[locale]/memes/store/memeStore';
import type { Meme, Tag } from '@/types/meme';
import { useAtomValue, useSetAtom } from 'jotai';
import { useHydrateAtoms } from 'jotai/utils';
import { Eye, Shuffle } from 'lucide-react';
import type { MasonryProps } from 'masonic';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { type ComponentType, useCallback } from 'react';
import MemeEditForm from './modals/MemeEditForm';
import MemeModal from './modals/MemeModal';

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
  useHydrateAtoms([
    [memesAtom, initialMemes],
    [allTagsAtom, allTags],
  ]);

  // 읽기 전용 원자들
  const key = useAtomValue(keyAtom);
  const displayedMemes = useAtomValue(displayedMemesAtom);
  const selectedTag = useAtomValue(selectedTagAtom);
  const isHiddenMode = useAtomValue(isHiddenModeAtom);
  const selectedId = useAtomValue(selectedIdAtom);

  const selectedMeme = displayedMemes.find((meme) => meme.id === selectedId);

  // 액션 원자들
  const shuffleMemes = useSetAtom(shuffleMemesAtom);
  const changeTag = useSetAtom(changeTagAtom);
  const showHiddenMemes = useSetAtom(toggleHiddenMemesAtom);
  const setSelectedMemeAction = useSetAtom(selectedIdAtom);

  const handleFormSuccess = useCallback(() => {
    setSelectedMemeAction(null);
  }, [setSelectedMemeAction]);

  const handleModalOpenChange = useCallback(
    (open: boolean) => {
      if (!open) {
        setSelectedMemeAction(null);
      }
    },
    [setSelectedMemeAction],
  );

  const isModalOpen = selectedId !== null;

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
        render={MemeCard}
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
              onCancel={() => setSelectedMemeAction(null)}
            />
          </div>
        )}
      </MemeModal>
    </div>
  );
}

const MemeCard = ({ data: meme }: { data: Meme }) => {
  const setSelectedMemeAction = useSetAtom(selectedIdAtom);

  return (
    <div className="no-underline hover:-translate-y-1 block border border-white/50">
      <button
        type="button"
        onClick={() => setSelectedMemeAction(meme.id)}
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
  );
};

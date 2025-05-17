'use client';
import {
  allTagsAtom,
  changeTagAtom,
  displayedMemesAtom,
  isHiddenModeAtom,
  keyAtom,
  memesAtom,
  selectedTagAtom,
  shuffleMemesAtom,
  toggleHiddenMemesAtom,
} from '@/app/[locale]/memes/store/memeStore';
import { Link } from '@/i18n/navigation';
import type { Meme, Tag } from '@/types/meme';
import { useAtomValue, useSetAtom } from 'jotai';
import { useHydrateAtoms } from 'jotai/utils';
import { Eye, Shuffle } from 'lucide-react';
import type { MasonryProps } from 'masonic';
import dynamic from 'next/dynamic';
import type { ComponentType } from 'react';

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

  // 액션 원자들
  const shuffleMemes = useSetAtom(shuffleMemesAtom);
  const changeTag = useSetAtom(changeTagAtom);
  const showHiddenMemes = useSetAtom(toggleHiddenMemesAtom);

  return (
    <div className="flex flex-col gap-8 w-full">
      <div className="flex flex-wrap gap-3 items-center p-4">
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
    </div>
  );
}

const MemeCard = ({ data: meme }: { data: Meme }) => {
  return (
    <div className="no-underline hover:-translate-y-1 block border border-white/50">
      <Link
        href={`/memes/${meme.id}`}
        className="cursor-pointer block p-0 bg-transparent w-full"
      >
        <img
          width={meme.width}
          height={meme.height}
          src={
            process.env.NODE_ENV === 'development'
              ? `https://placehold.co/${meme.width}x${meme.height}`
              : meme.media_url
          }
          alt={meme.title ?? ''}
          className="w-full"
        />
      </Link>
    </div>
  );
};

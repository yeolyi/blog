import type { Meme } from '@/types/helper.types';
import { useState } from 'react';
import MemeModal from './MemeModal';

export type MemeCardProps = Pick<
  Meme,
  'id' | 'media_url' | 'title' | 'height' | 'width'
>;

const MemeCard = ({ data: meme }: { data: MemeCardProps }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        aria-label={`밈 상세 보기: ${meme.title}`}
        className="flex flex-col bg-stone-700 cursor-pointer hover:opacity-90 transition-opacity text-left w-full p-0"
      >
        <img
          src={meme.media_url}
          alt={meme.title ?? ''}
          width={meme.width}
          height={meme.height}
        />
        <p className="text-white p-1">{meme.title}</p>
      </button>

      {isModalOpen && (
        <MemeModal meme={meme} onClose={() => setIsModalOpen(false)} />
      )}
    </>
  );
};

export default MemeCard;

import Tile from '@/app/components/Tile';
import { getRandomMeme } from '@/app/memes/actions';
import type { Meme } from '@/types/meme';
import { getMediaTypeFromUrl } from '@/utils/form';
import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';

export default async function MemeTile() {
  // 랜덤 밈 가져오기
  const meme = await getRandomMeme();
  if (!meme) return;

  const mediaType = getMediaTypeFromUrl(meme.media_url);

  return (
    <Tile.Item title="개발 밈 모음집" className="w-full">
      <Link href={`/memes/${meme.id}`} className="block">
        {mediaType === 'image' ? (
          <Image
            src={meme.media_url}
            alt={meme.title}
            width={500}
            height={400}
            className="object-cover aspect-[16/9] overflow-hidden w-full"
            priority
          />
        ) : (
          <video
            src={meme.media_url}
            muted
            loop
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
        )}
      </Link>
    </Tile.Item>
  );
}

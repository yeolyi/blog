import Tile from '@/app/components/Tile';
import Link from 'next/link';
import { getRandomMeme } from '@/app/memes/actions';
import MemeTileMedia from '@/app/components/MemeTileMedia';
import { Suspense } from 'react';

export default async function MemeTile() {
  // 랜덤 밈 가져오기
  const meme = await getRandomMeme();
  if (!meme) return;

  return (
    <Tile.Item title="개발 밈 모음집" size="75%">
      <Link href="/memes" className="block">
        <div className="relative aspect-[5/4] overflow-hidden">
          <Suspense>
            <MemeTileMedia meme={meme} />
          </Suspense>
        </div>
      </Link>
    </Tile.Item>
  );
}

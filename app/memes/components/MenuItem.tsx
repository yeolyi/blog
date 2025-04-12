'use client';

import { getMediaTypeFromUrl } from '@/utils/form';
import Image from 'next/image';
import Link from 'next/link';
import type { Meme } from '@/types/meme';

interface MemeItemProps {
  meme: Meme;
  ref: ((ref: HTMLDivElement) => void) | null;
}

export function MemeItem({ meme, ref }: MemeItemProps) {
  return (
    <div
      key={meme.id}
      ref={ref}
      className="border border-[#5e5e5e] hover:translate-y-[-4px] w-[300px]"
    >
      <Link href={`/memes/${meme.id}`} className="no-underline">
        {getMediaTypeFromUrl(meme.media_url) === 'image' ? (
          <Image
            src={meme.media_url}
            alt={meme.title}
            width={300}
            height={200}
            style={{ objectFit: 'cover' }}
          />
        ) : (
          <div className="w-full h-full">
            {/* biome-ignore lint/a11y/useMediaCaption: 보여줄 캡션이 없다... */}
            <video
              src={meme.media_url}
              controls
              style={{ width: '100%', height: '200px' }}
            >
              Your browser does not support video playback.
            </video>
          </div>
        )}

        <div className="p-4 flex flex-col gap-2">
          <h3 className="text-lg font-semibold text-white">{meme.title}</h3>
          {meme.description && (
            <p className="text-[#e0e0e0] text-sm overflow-hidden text-ellipsis whitespace-nowrap max-w-full">
              {meme.description}
            </p>
          )}

          <div className="flex flex-wrap gap-2">
            {meme.meme_tags.map((tag) => (
              <span
                key={tag.tag_id}
                className="bg-white text-black text-base font-medium"
              >
                {tag.tags.name}
              </span>
            ))}
          </div>
        </div>
      </Link>
    </div>
  );
}

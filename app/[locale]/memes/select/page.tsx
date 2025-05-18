'use client';

import { memeImagesAtom } from '@/app/[locale]/memes/store';
import { useAtomValue } from 'jotai';

export default function SelectPage() {
  const imageUrls = useAtomValue(memeImagesAtom);

  const getProxiedImageUrl = (originalUrl: string) => {
    return `/api/image-proxy?url=${encodeURIComponent(originalUrl)}`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {imageUrls.map((url) => (
        <div key={url} className="border rounded overflow-hidden">
          <img
            src={getProxiedImageUrl(url)}
            alt="밈 이미지"
            className="w-full h-auto"
            loading="lazy"
          />
        </div>
      ))}
    </div>
  );
}

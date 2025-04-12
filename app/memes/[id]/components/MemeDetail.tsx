'use client';

import type { Meme } from '@/types/meme';
import { getMediaTypeFromUrl } from '@/utils/form';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { deleteMeme } from '@/app/memes/actions';
import { useRouter } from 'next/navigation';

interface MemeDetailProps {
  meme: Meme;
  isAdmin: boolean;
}

export default function MemeDetail({ meme, isAdmin }: MemeDetailProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (confirm('정말로 이 밈을 삭제하시겠습니까?')) {
      setIsDeleting(true);
      try {
        await deleteMeme(meme.id);
        router.push('/memes');
      } catch (error) {
        console.error('삭제 중 오류:', error);
        alert('삭제 중 오류가 발생했습니다.');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <div className="flex flex-col gap-8 max-w-[600px] mx-auto mt-20 mb-40 p-4">
      <div className="relative max-w-[800px] w-full aspect-square mx-auto text-center">
        {getMediaTypeFromUrl(meme.media_url) === 'image' ? (
          <Image
            src={meme.media_url}
            alt={meme.title}
            fill
            style={{
              objectFit: 'contain',
            }}
          />
        ) : (
          // biome-ignore lint/a11y/useMediaCaption: 보여줄 캡션이 없다...
<video className="max-w-full h-auto" src={meme.media_url} controls>
            Your browser does not support video playback.
          </video>
        )}
      </div>

      <div className="p-4 bg-[rgba(30,30,30,0.3)] border border-[#5e5e5e]">
        <h1 className="mb-2 text-3xl font-semibold text-white">{meme.title}</h1>

        {meme.description && (
          <p className="mb-4 text-lg leading-relaxed text-[#e0e0e0]">
            {meme.description}
          </p>
        )}

        <div className="flex flex-wrap gap-3">
          {meme.meme_tags.length > 0 ? (
            meme.meme_tags.map((tag) => (
              <span
                key={tag.tag_id}
                className="bg-white text-black py-2 px-4 text-sm font-medium"
              >
                {tag.tags.name}
              </span>
            ))
          ) : (
            <span className="text-[#aaaaaa] italic">태그 없음</span>
          )}
        </div>

        {isAdmin && (
          <div className="mt-8 flex gap-4">
            <Link
              href={`/memes/${meme.id}/edit`}
              className="bg-[#4caf50] text-white py-2 px-4 no-underline hover:bg-[#66bb6a]"
            >
              수정하기
            </Link>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-[#ff4d4f] text-white py-2 px-4 border-none font-medium cursor-pointer hover:bg-[#ff7875] disabled:opacity-60 disabled:cursor-not-allowed"
              type="button"
            >
              {isDeleting ? '삭제 중...' : '삭제하기'}
            </button>
          </div>
        )}
      </div>

      <Link
        href="/memes"
        className="text-white no-underline font-medium hover:text-[#e0e0e0] hover:underline"
      >
        ← 목록으로 돌아가기
      </Link>
    </div>
  );
}

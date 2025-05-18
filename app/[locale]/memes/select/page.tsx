'use client';

import Button from '@/app/[locale]/components/ui/Button';
import {
  memeImagesAtom,
  selectedMemeImagesAtom,
} from '@/app/[locale]/memes/store';
import { useRouter } from '@/i18n/navigation';
import clsx from 'clsx';
import { useAtom, useAtomValue } from 'jotai';
import { Check } from 'lucide-react';
import { useState } from 'react';
import { uploadMultipleMemes } from '../actions';

export default function SelectPage() {
  const router = useRouter();
  const imageUrls = useAtomValue(memeImagesAtom);
  const [selectedImages, setSelectedImages] = useAtom(selectedMemeImagesAtom);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getProxiedImageUrl = (originalUrl: string) => {
    return `/api/image-proxy?url=${encodeURIComponent(originalUrl)}`;
  };

  const toggleImageSelection = (url: string) => {
    setSelectedImages((prev) => {
      if (prev.includes(url)) {
        return prev.filter((item) => item !== url);
      }
      return [...prev, url];
    });
  };

  const handleComplete = async () => {
    if (selectedImages.length === 0) {
      window.alert('하나 이상의 이미지를 선택해주세요');
      return;
    }

    setIsSubmitting(true);

    try {
      await uploadMultipleMemes(
        selectedImages.map((url) => ({
          title: 'imported',
          imageURL: url,
        })),
      );

      window.alert('선택한 밈이 추가되었습니다');
      // 작업이 끝나면 상태 초기화
      setSelectedImages([]);
      router.push('/memes');
    } catch (error) {
      console.error('밈 업로드 오류:', error);
      window.alert('업로드 중 오류가 발생했습니다');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {imageUrls.map((url) => (
          <button
            key={url}
            type="button"
            className={clsx(
              'w-full h-full cursor-pointer relative',
              selectedImages.includes(url) ? 'opacity-50' : 'opacity-100',
            )}
            onClick={() => toggleImageSelection(url)}
            aria-pressed={selectedImages.includes(url)}
          >
            <img
              src={getProxiedImageUrl(url)}
              alt="밈 이미지"
              className="w-full h-auto"
              loading="lazy"
            />
            {selectedImages.includes(url) && (
              <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
                ✓
              </div>
            )}
          </button>
        ))}
      </div>

      <Button
        theme="green"
        onClick={handleComplete}
        Icon={Check}
        disabled={isSubmitting || selectedImages.length === 0}
        className="fixed bottom-10 left-1/2 -translate-x-1/2"
      >
        {isSubmitting ? '추가 중...' : `${selectedImages.length}개 이미지 추가`}
      </Button>
    </>
  );
}

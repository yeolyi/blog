'use client';

import Slider from '@/components/ui/Slider';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';

import { layerBg } from '@/components/ui/theme';
import clsx from 'clsx';
import { debounce } from 'es-toolkit';
// https://pixabay.com/photos/changdeokgung-palace-garden-786592/
import changdeokgung from './assets/changdeokgung.jpg';

// TODO: 고해상도로 도전해보기
export default function PixelateImage() {
  const t = useTranslations('ZeroAndOne.PixelateImage');
  const [pixelCntPow, setPixelCntPow] = useState(5);

  const [pixelatedImageSrc, setPixelatedImageSrc] = useState('');
  const [canvasRef, setCanvasRef] = useState<HTMLCanvasElement | null>(null);
  const [imageRef, setImageRef] = useState<HTMLImageElement | null>(null);
  const [originalLoaded, setOriginalLoaded] = useState(false);
  const workerRef = useRef<Worker | null>(null);

  const pixelCnt = 2 ** pixelCntPow;

  // 웹 워커 초기화
  useEffect(() => {
    if (typeof window === 'undefined') return;

    workerRef.current = new Worker('/pixelateWorker.js');
    workerRef.current.onmessage = (e) => {
      if (e.data.status === 'success') {
        setPixelatedImageSrc(e.data.result);
      } else {
        console.error('웹 워커 오류:', e.data.error);
      }
    };

    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  const handleImageLoad = () => {
    setOriginalLoaded(true);
  };

  // 픽셀 크기가 변경되거나 이미지가 로드되면 픽셀화 실행
  useEffect(() => {
    if (originalLoaded && canvasRef && imageRef && workerRef.current) {
      processImageWithWorker(canvasRef, imageRef, pixelCnt);
    }
  }, [originalLoaded, pixelCnt, canvasRef, imageRef]);

  const processImageWithWorker = useCallback(
    debounce(
      (canvas: HTMLCanvasElement, img: HTMLImageElement, pixelCnt: number) => {
        // 캔버스 크기를 이미지 크기로 설정
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;

        // 이미지 데이터 가져오기
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) return;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

        // 웹 워커로 데이터 전송
        workerRef.current?.postMessage(
          {
            imageData: imageData.data.buffer,
            pixelCnt,
            width: canvas.width,
            height: canvas.height,
          },
          // ArrayBuffer를 전송하므로 메모리 복사 방지를 위해 전송??
          [imageData.data.buffer],
        );
      },
      // TODO: 100ms안에는 되겠지...? 일단 겹치는건 처리 안함
      100,
    ),
    [],
  );

  return (
    <div className={clsx('p-4 not-prose flex flex-col gap-4 w-full', layerBg)}>
      <Image
        ref={setImageRef}
        src={changdeokgung}
        alt="창덕궁"
        className="object-cover aspect-video opacity-0 absolute pointer-events-none"
        onLoad={handleImageLoad}
        unoptimized
      />

      <p className="text-sm font-medium">
        {t('digitalizedImage')} ({pixelCnt}x{pixelCnt})
      </p>

      <div className="relative aspect-video w-full overflow-hidden">
        {pixelatedImageSrc && (
          <img
            src={pixelatedImageSrc}
            alt="픽셀화된 이미지"
            className="object-cover w-full h-full"
            width={1600}
            height={900}
          />
        )}
      </div>
      <Slider
        label={`N: ${pixelCnt}`}
        value={pixelCntPow}
        onValueChange={setPixelCntPow}
        max={10}
        min={1}
        step={1}
        ariaLabel={t('pixelSize')}
        className="w-full"
        rangeClassName="bg-blue-500"
      />

      {/* 숨겨진 캔버스 */}
      <canvas ref={setCanvasRef} className="hidden" />
    </div>
  );
}

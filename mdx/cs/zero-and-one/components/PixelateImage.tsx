'use client';

import * as Slider from '@radix-ui/react-slider';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useEffect, useState } from 'react';

// https://pixabay.com/photos/changdeokgung-palace-garden-786592/
import changdeokgung from '../assets/changdeokgung.jpg';

// TODO: 고해상도로 도전해보기
export default function PixelateImage() {
  const t = useTranslations('ZeroAndOne.PixelateImage');
  const [pixelCntPow, setPixelCntPow] = useState(5);
  const [pixelatedImageSrc, setPixelatedImageSrc] = useState('');
  const [canvasRef, setCanvasRef] = useState<HTMLCanvasElement | null>(null);
  const [imageRef, setImageRef] = useState<HTMLImageElement | null>(null);
  const [originalLoaded, setOriginalLoaded] = useState(false);

  const pixelCnt = 2 ** pixelCntPow;

  // 이미지가 로드되면 원본 로드 상태 변경
  const handleImageLoad = () => {
    setOriginalLoaded(true);
  };

  // 픽셀 크기가 변경되거나 이미지가 로드되면 픽셀화 실행
  useEffect(() => {
    if (originalLoaded && canvasRef && imageRef) {
      const pixelatedImageSrc = pixelateImage(canvasRef, imageRef, pixelCnt);
      if (pixelatedImageSrc) {
        setPixelatedImageSrc(pixelatedImageSrc);
      }
    }
  }, [originalLoaded, pixelCnt, canvasRef, imageRef]);

  return (
    <div className="mb-8 border border-[#5e5e5e] p-6 rounded-none not-prose">
      <div className="mb-8 flex flex-col md:flex-row items-start gap-6">
        <div className="w-full md:w-1/2">
          <p className="text-sm font-medium mb-2">{t('analogLandscape')}</p>
          <div className="relative border border-[#5e5e5e]">
            <Image
              ref={setImageRef}
              src={changdeokgung}
              alt="원본 이미지"
              className="w-full h-48 object-cover"
              onLoad={handleImageLoad}
              unoptimized
            />
          </div>
        </div>

        <div className="w-full md:w-1/2">
          <p className="text-sm font-medium mb-2">
            {t('digitalizedImage')} ({pixelCnt}x{pixelCnt})
          </p>
          <div className="relative border border-[#5e5e5e]">
            {pixelatedImageSrc ? (
              <img
                src={pixelatedImageSrc}
                alt="픽셀화된 이미지"
                className="w-full h-48 object-cover"
              />
            ) : (
              <div className="w-full h-48 flex items-center justify-center">
                {t('loading')}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-sm font-medium whitespace-nowrap">
          N: {pixelCnt}
        </span>
        <Slider.Root
          className="relative flex items-center select-none touch-none w-full h-5"
          value={[pixelCntPow]}
          onValueChange={([value]) => setPixelCntPow(value)}
          max={9}
          min={1}
          step={1}
          aria-label={t('pixelSize')}
        >
          <Slider.Track className="bg-white/20 relative grow rounded-full h-[3px]">
            <Slider.Range className="absolute bg-blue-500 rounded-full h-full" />
          </Slider.Track>
          <Slider.Thumb className="block w-5 h-5 bg-white rounded-full hover:bg-gray-300 focus:bg-gray-300 cursor-pointer" />
        </Slider.Root>
      </div>

      {/* 숨겨진 캔버스 */}
      <canvas ref={setCanvasRef} className="hidden" />
    </div>
  );
}

const pixelateImage = (
  canvas: HTMLCanvasElement,
  img: HTMLImageElement,
  pixelCnt: number,
) => {
  // Canvas2D: Multiple readback operations using getImageData are
  // faster with the willReadFrequently attribute set to true. See:
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return;

  // 캔버스 크기를 이미지 크기로 설정
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;

  // 원본 이미지 그리기
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  // 이미지 데이터 가져오기
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  // 픽셀 블록 크기 계산
  const blockWidth = Math.ceil(canvas.width / pixelCnt);
  const blockHeight = Math.ceil(canvas.height / pixelCnt);

  // 이미지 데이터 초기화
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 각 픽셀 블록에 대해 평균 색상을 계산하고 그 블록을 해당 색상으로 채움
  for (let y = 0; y < pixelCnt; y++) {
    for (let x = 0; x < pixelCnt; x++) {
      let r = 0;
      let g = 0;
      let b = 0;
      let a = 0;
      let count = 0;

      // 각 블록의 시작/끝 좌표 계산 (이미지 가장자리 처리)
      const startX = x * blockWidth;
      const endX = Math.min((x + 1) * blockWidth, canvas.width);
      const startY = y * blockHeight;
      const endY = Math.min((y + 1) * blockHeight, canvas.height);

      // 블록 내의 모든 픽셀에 대한 색상의 합 계산
      for (let blockY = startY; blockY < endY; blockY++) {
        for (let blockX = startX; blockX < endX; blockX++) {
          const i = (blockY * canvas.width + blockX) * 4;
          r += data[i];
          g += data[i + 1];
          b += data[i + 2];
          a += data[i + 3];
          count++;
        }
      }

      // 색상 평균 계산
      if (count > 0) {
        r = Math.floor(r / count);
        g = Math.floor(g / count);
        b = Math.floor(b / count);
        a = Math.floor(a / count);

        // 해당 블록을 평균 색상으로 채움
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a / 255})`;
        ctx.fillRect(startX, startY, endX - startX, endY - startY);
      }
    }
  }

  // 픽셀화된 이미지를 데이터 URL로 변환
  return canvas.toDataURL('image/png');
};

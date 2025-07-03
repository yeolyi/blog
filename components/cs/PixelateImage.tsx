'use client';

import { debounce } from 'es-toolkit';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
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

	// 픽셀 크기가 변경되거나 이미지가 로드되면 픽셀화 실행
	useEffect(() => {
		if (originalLoaded && canvasRef && imageRef && workerRef.current) {
			processImageWithWorker(canvasRef, imageRef, pixelCnt);
		}
	}, [originalLoaded, pixelCnt, canvasRef, imageRef, processImageWithWorker]);

	return (
		<Card>
			<CardHeader>
				<CardTitle>{t('digitalizedImage')}</CardTitle>
				<CardDescription>
					{pixelCnt}x{pixelCnt}
				</CardDescription>
			</CardHeader>

			<CardContent>
				<div className='relative w-full h-[250px]'>
					{pixelatedImageSrc && (
						// biome-ignore lint/performance/noImgElement: next/Image도 src string을 받는지 모르겠음
						<img
							src={pixelatedImageSrc}
							alt='픽셀화된 이미지'
							className='object-cover w-full h-full'
						/>
					)}
				</div>
			</CardContent>

			<CardFooter>
				<Slider
					value={[pixelCntPow]}
					onValueChange={([val]) => setPixelCntPow(val)}
					max={10}
					min={1}
					step={1}
				/>
			</CardFooter>

			{/* 숨어있는 이미지고 스크롤 방지하려면 max-w 설정 필요 */}
			<Image
				ref={setImageRef}
				src={changdeokgung}
				alt='창덕궁'
				className='object-cover aspect-video opacity-0 absolute pointer-events-none max-w-[256px]'
				onLoad={handleImageLoad}
				unoptimized
			/>
			{/* 숨겨진 캔버스 */}
			<canvas ref={setCanvasRef} className='hidden' />
		</Card>
	);
}

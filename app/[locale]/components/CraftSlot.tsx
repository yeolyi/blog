'use client';

import { useRef, useState } from 'react';

const WORD = 'CRAFT';
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

// 초기 문자들의 알파벳 인덱스 구하기
const getInitialIndices = () => {
	return WORD.split('').map((char) => ALPHABET.indexOf(char));
};

export default function CraftTypography() {
	const [charIndices, setCharIndices] = useState<number[]>(getInitialIndices());
	const [isDragging, setIsDragging] = useState<number | null>(null);
	const startY = useRef<number>(0);
	const lastY = useRef<number>(0);

	const handlePointerDown = (e: React.PointerEvent, charIdx: number) => {
		e.preventDefault();
		setIsDragging(charIdx);
		startY.current = e.clientY;
		lastY.current = e.clientY;
		(e.target as HTMLElement).setPointerCapture(e.pointerId);
	};

	const handlePointerMove = (e: React.PointerEvent, charIdx: number) => {
		if (isDragging !== charIdx) return;

		const deltaY = lastY.current - e.clientY;
		const threshold = 50; // 드래그 민감도

		if (Math.abs(deltaY) > threshold) {
			setCharIndices((prev) => {
				const newIndices = [...prev];
				if (deltaY > 0) {
					// 위로 드래그 - 다음 문자
					newIndices[charIdx] = (newIndices[charIdx] + 1) % ALPHABET.length;
				} else {
					// 아래로 드래그 - 이전 문자
					newIndices[charIdx] =
						(newIndices[charIdx] - 1 + ALPHABET.length) % ALPHABET.length;
				}
				return newIndices;
			});
			lastY.current = e.clientY;
		}
	};

	const handlePointerUp = (e: React.PointerEvent) => {
		setIsDragging(null);
		(e.target as HTMLElement).releasePointerCapture(e.pointerId);
	};

	return (
		<div className='flex items-center justify-center select-none w-full h-full aspect-video min-h-[384px]'>
			<div className='flex items-center gap-2 relative'>
				{/* 선택된 항목을 강조하는 배경 */}
				<div className='absolute inset-0 flex items-center justify-center pointer-events-none'>
					<div className='w-full h-[min(12vw,130px)] bg-card border border-border'></div>
				</div>
				{charIndices.map((currentIdx, charIdx) => {
					const prevIdx = (currentIdx - 1 + ALPHABET.length) % ALPHABET.length;
					const nextIdx = (currentIdx + 1) % ALPHABET.length;

					const prevChar = ALPHABET[prevIdx];
					const currentChar = ALPHABET[currentIdx];
					const nextChar = ALPHABET[nextIdx];

					return (
						<div
							key={charIdx}
							className='flex items-center flex-col text-[min(12vw,130px)] cursor-grab active:cursor-grabbing touch-none w-[min(12vw,130px)]'
							onPointerDown={(e) => handlePointerDown(e, charIdx)}
							onPointerMove={(e) => handlePointerMove(e, charIdx)}
							onPointerUp={handlePointerUp}
							style={{ perspective: '200px' }}
						>
							<span
								className='leading-none font-black text-muted-foreground opacity-30'
								style={{ transform: 'rotateX(30deg)' }}
							>
								{prevChar}
							</span>
							<span className='leading-none font-black text-black dark:text-white'>
								{currentChar}
							</span>
							<span
								className='leading-none font-black text-muted-foreground opacity-30'
								style={{ transform: 'rotateX(-30deg)' }}
							>
								{nextChar}
							</span>
						</div>
					);
				})}
			</div>
		</div>
	);
}

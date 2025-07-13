'use client';

import { useEffect, useRef, useState } from 'react';

// Pool of characters to cycle through during the spin
const CHAR_POOL = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const WORD = 'WORKS';

// === Animation tuning constants ===
// 기본 회전 속도(ms)
const BASE_SPEED = 40;
// 각 글자마다 속도 증가량(ms)
const SPEED_STEP = 20;
// 첫 글자가 멈출 때까지 걸리는 시간(ms)
const BASE_DURATION = 1500;
// 각 글자마다 멈추기까지 추가로 걸리는 시간(ms)
const DURATION_STEP = 300;
// 모든 글자가 맞춰진 뒤 다음 회전을 시작하기 전 대기 시간(ms)
const REST_DURATION = 1500;

/**
 * 애니메이션이 끝없이 반복되는 슬롯머신 스타일의 텍스트 컴포넌트.
 * 각 글자는 서로 다른 속도로 회전하다가 최종 글자에 맞춰지고,
 * 잠시 멈춘 뒤 다시 회전 과정을 반복합니다.
 */
export default function CraftSlot() {
	const [letters, setLetters] = useState<string[]>(() => WORD.split(''));
	// 인터벌과 타임아웃을 저장해 두었다가 언마운트 시 정리
	const intervals = useRef<Array<ReturnType<typeof setInterval>>>([]);
	const timeouts = useRef<Array<ReturnType<typeof setTimeout>>>([]);

	useEffect(() => {
		let cancelled = false;

		const startSpin = () => {
			if (cancelled) return;

			// 글자를 랜덤으로 돌리기 시작
			WORD.split('').forEach((finalChar, idx) => {
				const speed = BASE_SPEED + idx * SPEED_STEP; // 각 글자별 속도 차이
				const duration = BASE_DURATION + idx * DURATION_STEP; // 멈추기까지 걸리는 시간

				const intervalId = setInterval(() => {
					setLetters((prev) => {
						const next = [...prev];
						next[idx] = CHAR_POOL[Math.floor(Math.random() * CHAR_POOL.length)];
						return next;
					});
				}, speed);
				intervals.current.push(intervalId);

				const timeoutId = setTimeout(() => {
					clearInterval(intervalId);
					setLetters((prev) => {
						const next = [...prev];
						next[idx] = finalChar;
						return next;
					});
				}, duration);
				timeouts.current.push(timeoutId);
			});

			// 전체 애니메이션이 끝난 뒤 잠시 멈췄다가 다시 시작
			const totalDuration =
				BASE_DURATION + (WORD.length - 1) * DURATION_STEP + REST_DURATION; // 마지막 글자 멈춤 + 정지 시간
			const restartTimeoutId = setTimeout(() => {
				startSpin();
			}, totalDuration);
			timeouts.current.push(restartTimeoutId);
		};

		startSpin();

		return () => {
			cancelled = true;
			intervals.current.forEach(clearInterval);
			timeouts.current.forEach(clearTimeout);
		};
	}, []);

	return (
		<div className='flex items-center justify-center select-none w-full h-full'>
			<p className='text-[min(6vw,70px)] leading-[1.375] font-black'>
				{letters.join('')}
			</p>
		</div>
	);
}

'use client';

import type React from 'react';
import { useCallback, useEffect, useState } from 'react';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

// 신호 시각화 컴포넌트
interface SignalVisualizerProps {
	value: number;
	range: [number, number];
}

const SignalVisualizer: React.FC<SignalVisualizerProps> = ({
	value,
	range,
}) => {
	const isError = value < range[0] || value > range[1];
	return (
		<div className='h-48 relative mb-4 border text-xs'>
			{/* 유효 범위 상한선 */}
			<div
				className='absolute left-0 w-full border-t-1 border-white z-10'
				style={{ bottom: `${range[1] * 100}%` }}
			>
				<span className='absolute right-2 -mt-1 -translate-y-full'>
					유효 상한: {range[1].toFixed(2)}
				</span>
			</div>

			{/* 유효 범위 하한선 */}
			<div
				className='absolute left-0 w-full border-t-1 border-white z-10'
				style={{ bottom: `${range[0] * 100}%` }}
			>
				<span className='absolute right-2 mt-1'>
					유효 하한: {range[0].toFixed(2)}
				</span>
			</div>

			{/* 신호값 */}
			<div
				className={`absolute left-0 w-full transition-all duration-300 ${
					isError ? 'bg-fail' : 'bg-success'
				}`}
				style={{
					bottom: 0,
					height: `${value * 100}%`,
				}}
			/>
		</div>
	);
};

export default function SignalComparison(): React.ReactElement {
	const [errorRate, setErrorRate] = useState<number>(10); // 기본 오류율 10%
	const [noisyBinarySignal, setNoisyBinarySignal] = useState<number>(0.75);
	const [noisyDecimalSignal, setNoisyDecimalSignal] = useState<number>(0.5);

	// 랜덤 노이즈 적용
	const applyRandomNoise = useCallback(() => {
		const noise = (Math.random() * 2 - 1) * (errorRate / 100);

		const getNoisySignal = (original: number): number => {
			return Math.max(0, Math.min(1, original + noise));
		};

		setNoisyBinarySignal(getNoisySignal(1));
		setNoisyDecimalSignal(getNoisySignal(0.5));
	}, [errorRate]);

	useEffect(() => {
		applyRandomNoise();
		const id = setInterval(applyRandomNoise, 1000);
		return () => clearInterval(id);
	}, [applyRandomNoise]);

	return (
		<Card>
			<CardHeader>
				<CardTitle>아날로그 vs 디지털 신호</CardTitle>
				<CardDescription>
					노이즈가 아날로그 신호와 디지털 신호의 값 해석에 어떤 영향을 미치는지
					비교해 보세요.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className='flex flex-col md:flex-row items-start gap-6'>
					<div className='w-full md:w-1/2'>
						<p className='mb-2'>
							디지털 신호 <span className='text-muted-foreground'>목표값 1</span>
						</p>
						<SignalVisualizer value={noisyBinarySignal} range={[0.5, 1]} />
					</div>

					<div className='w-full md:w-1/2'>
						<p>
							아날로그 신호 <span className='text-muted-foreground'>목표값 5</span>
						</p>
						<SignalVisualizer value={noisyDecimalSignal} range={[0.45, 0.55]} />
					</div>
				</div>

				<div className='flex flex-col gap-2 pt-4'>
					<Label>오차 범위</Label>
					<Slider
						value={[errorRate]}
						onValueChange={(value) => setErrorRate(value[0])}
						min={0}
						max={50}
						step={1}
						className='w-full'
					/>
				</div>
			</CardContent>
		</Card>
	);
}

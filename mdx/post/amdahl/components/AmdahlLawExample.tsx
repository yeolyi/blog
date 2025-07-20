'use client';

import { useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

const AmdahlLawExample = () => {
	const [proportion, setProportion] = useState(40); // P as a percentage
	const [speedup, setSpeedup] = useState(2); // S

	const overallSpeedup = useMemo(() => {
		const p = proportion / 100;
		if (p === 1 && speedup > 0) return speedup;
		if (speedup <= 0) return 1;
		return 1 / (1 - p + p / speedup);
	}, [proportion, speedup]);

	const maxSpeedup = useMemo(() => {
		const p = proportion / 100;
		if (p === 1) return Infinity;
		return 1 / (1 - p);
	}, [proportion]);

	return (
		<Card>
			<CardContent>
				<p className='leading-relaxed'>
					전체의{' '}
					<Badge variant='outline' className='font-bold tabular-nums'>
						{proportion}%
					</Badge>{' '}
					부분의 성능이{' '}
					<Badge variant='outline' className='font-bold tabular-nums'>
						{speedup.toFixed(1)}배
					</Badge>
					로 향상되었을 때, 전체 성능은{' '}
					<Badge variant='secondary' className='font-bold tabular-nums'>
						{overallSpeedup.toFixed(2)}배
					</Badge>{' '}
					증가합니다. 하지만 성능 향상폭이 무한히 높아져도 전체 성능의 증가폭은{' '}
					<Badge variant='secondary' className='font-bold tabular-nums'>
						{maxSpeedup === Infinity ? '무한대' : `${maxSpeedup.toFixed(2)}배`}
					</Badge>
					를 넘지 못합니다.
				</p>

				<div className='space-y-7 pt-7'>
					<div>
						<Label
							htmlFor='proportion-slider'
							className='block text-sm font-medium text-foreground'
						>
							개선할 부분의 비율 ({proportion}%)
						</Label>
						<Slider
							id='proportion-slider'
							value={[proportion]}
							onValueChange={(val) => setProportion(val[0])}
							max={100}
							step={1}
							className='mt-2'
						/>
					</div>

					<div>
						<Label
							htmlFor='speedup-slider'
							className='block text-sm font-medium text-foreground'
						>
							해당 부분의 성능 향상 배율 ({speedup.toFixed(1)}배)
						</Label>
						<Slider
							id='speedup-slider'
							value={[speedup]}
							onValueChange={(val) => setSpeedup(val[0])}
							min={1}
							max={100}
							step={0.1}
							className='mt-2'
						/>
					</div>
				</div>
			</CardContent>
		</Card>
	);
};

export default AmdahlLawExample;

'use client';

import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

const AmdahlLawExample = () => {
	const t = useTranslations('AmdahlLawExample');
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
				<p>
					{t.rich('description', {
						proportion: () => (
							<Badge variant='outline' className='font-bold tabular-nums'>
								{proportion}%
							</Badge>
						),
						speedup: () => (
							<Badge variant='outline' className='font-bold tabular-nums'>
								{speedup.toFixed(1)}
							</Badge>
						),
						overallSpeedup: () => (
							<Badge variant='secondary' className='font-bold tabular-nums'>
								{overallSpeedup.toFixed(2)}
							</Badge>
						),
						maxSpeedup: () => (
							<Badge variant='secondary' className='font-bold tabular-nums'>
								{maxSpeedup === Infinity ? t('infinity') : maxSpeedup.toFixed(2)}
							</Badge>
						),
					})}
				</p>

				<div className='space-y-7 pt-7'>
					<div>
						<Label htmlFor='proportion-slider'>
							{t('proportionLabel', { value: proportion })}
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
						<Label htmlFor='speedup-slider'>
							{t('speedupLabel', { value: speedup.toFixed(1) })}
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

'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '../../../../components/ui/card';
import { Textarea } from '../../../../components/ui/textarea';

const WIDTH = 10;
const HEIGHT = 10;

const PALETTE = [
	'#FFFFFF', // 0: White
	'#000000', // 1: Black
];

const GHOST_PATTERN = [
	'0101010101',
	'1010101010',
	'0101010101',
	'1010101010',
	'0101010101',
	'1010101010',
	'0101010101',
	'1010101010',
	'0101010101',
	'1010101010',
].join('');

export function MonitorSimulator() {
	const t = useTranslations('VonNeumann.Monitor');

	const [text, setText] = useState(
		GHOST_PATTERN.match(new RegExp(`.{1,${WIDTH}}`, 'g'))?.join('\n') ?? '',
	);

	const memory = Array.from({ length: HEIGHT }, (_, rowIndex) => {
		const line = text.split('\n')[rowIndex] || '';
		return line.replace(/[^01]/g, '').slice(0, WIDTH).padEnd(WIDTH, '0');
	})
		.join('')
		.split('')
		.map(Number);

	return (
		<Card>
			<CardHeader>
				<CardTitle>{t('title')}</CardTitle>
				<CardDescription>{t('description')}</CardDescription>
			</CardHeader>
			<CardContent className='grid grid-cols-1 md:grid-cols-2 gap-6'>
				<div>
					<h3 className='font-semibold text-center mb-2'>
						{t('screen', { height: HEIGHT, width: WIDTH })}
					</h3>
					<div
						className='grid border bg-black/10'
						style={{
							gridTemplateColumns: `repeat(${WIDTH}, 1fr)`,
							width: '100%',
							aspectRatio: `${WIDTH}/${HEIGHT}`,
						}}
					>
						{memory.map((colorIndex, i) => (
							<div
								key={i}
								className='w-full h-full'
								style={{ backgroundColor: PALETTE[colorIndex] }}
							/>
						))}
					</div>
				</div>
				<div>
					<h3 className='font-semibold mb-2'>{t('vram')}</h3>
					<Textarea
						value={text}
						onChange={(e) => setText(e.target.value)}
						rows={HEIGHT}
						className='font-mono tracking-widest leading-5'
					/>
					<p className='text-xs text-muted-foreground mt-2'>{t('guide')}</p>
				</div>
			</CardContent>
		</Card>
	);
}

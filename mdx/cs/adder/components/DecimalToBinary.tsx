'use client';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export default function DecimalToBinary() {
	const [val, setVal] = useState('5');
	const t = useTranslations('CS');

	const num = Number.parseInt(val);
	const binary = num.toString(2);
	const digits = binary.split('').map((bit, idx) => ({
		bit: Number(bit),
		power: binary.length - idx - 1,
		value: bit === '1' ? 2 ** (binary.length - idx - 1) : 0,
	}));

	const nonZeroDigits = digits.filter((d) => d.bit === 1);

	return (
		<Card>
			<CardHeader>
				<CardTitle>{t('decimalToBinary')}</CardTitle>
				<CardDescription>{t('decimalToBinaryDesc')}</CardDescription>
			</CardHeader>
			<CardContent className='space-y-4'>
				<Input
					type='text'
					value={val}
					onChange={(e) => {
						const numberOnly = e.target.value.replace(/[^0-9]/g, '');
						if (numberOnly.length > 10) {
							setVal(numberOnly.slice(0, 10));
						} else {
							setVal(numberOnly);
						}
					}}
					placeholder={t('enterDecimal')}
					className='max-w-xs'
				/>
				<div>
					{!Number.isNaN(num) && (
						<div className='font-mono overflow-x-auto whitespace-nowrap'>
							<span className='font-bold'>
								{digits.map((d) => d.bit).join('')}
								<sub>2</sub>
							</span>

							<br />
							{' = '}

							{nonZeroDigits.map((d, idx) => (
								<span key={idx}>
									<span className='font-bold'>{d.bit}</span>
									{' × '}
									<span>
										2<sup>{d.power}</sup>
									</span>
									{idx < nonZeroDigits.length - 1 && ' + '}
								</span>
							))}

							<br />
							{' = '}

							{nonZeroDigits.map((d, idx) => (
								<span key={idx}>
									<span>{d.value}</span>
									{idx < nonZeroDigits.length - 1 && <span className='mx-1'>+</span>}
								</span>
							))}
							<span className='mx-2'>=</span>
							<span className='font-bold'>{num}</span>
							<sub>10</sub>
						</div>
					)}
				</div>
			</CardContent>
		</Card>
	);
}

'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { Link } from '@/i18n/navigation';

export default function InstagramDescription() {
	const t = useTranslations('InstagramDescription');
	// @ts-expect-error 맞음
	const descriptions = Array.from({ length: 24 }, (_, idx) => t(String(idx)));

	const [index, setIndex] = useState(0);

	useEffect(() => {
		const intervalId = setInterval(() => {
			setIndex((prevIndex) => (prevIndex + 1) % descriptions.length);
		}, 1500);

		return () => clearInterval(intervalId);
	}, [descriptions.length]);

	return (
		<div className='relative h-[50vh] w-full px-16'>
			{descriptions.map((description, idx) => (
				<p
					key={idx}
					suppressHydrationWarning
					className='text-[min(6vw,70px)] leading-[1.375] font-black text-center absolute top-1/2 left-0 -translate-y-1/2 right-0 block text-pretty'
					style={{
						opacity: index === idx ? 1 : 0,
					}}
				>
					<Link
						href='https://instagram.com/yeol.dev'
						className='underline cursor-pointer'
						target='_blank'
						rel='noopener noreferrer'
					>
						@yeol.dev
					</Link>
					<span className='pointer-events-none'>{description}</span>
				</p>
			))}
		</div>
	);
}

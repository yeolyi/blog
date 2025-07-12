'use client';

import { useLocale } from 'next-intl';
import { useEffect, useState } from 'react';
import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/utils';
import { descriptionsMap } from './descriptions';

export default function InstagramDescription() {
	const locale = useLocale();
	// fallback to 'ko' if locale not found
	const descriptions = descriptionsMap[locale] ?? descriptionsMap.ko;

	const [index, setIndex] = useState(0);

	useEffect(() => {
		const intervalId = setInterval(() => {
			setIndex((prevIndex) => (prevIndex + 1) % descriptions.length);
		}, 1000);

		return () => clearInterval(intervalId);
	}, [descriptions.length]);

	return (
		<div className='aspect-video flex items-center justify-center px-16 relative select-none'>
			<Text>{descriptions[index]}</Text>
		</div>
	);
}

const Text = ({
	className,
	children,
}: {
	className?: string;
	children: React.ReactNode;
}) => {
	return (
		<p
			suppressHydrationWarning
			className={cn(
				'text-[min(6vw,70px)] leading-[1.375] font-black text-center block text-pretty',
				className,
			)}
		>
			<Link
				href='https://instagram.com/yeol.dev'
				className='underline cursor-pointer'
				target='_blank'
				rel='noopener noreferrer'
			>
				@yeol.dev
			</Link>
			<span className='pointer-events-none'>{children}</span>
		</p>
	);
};

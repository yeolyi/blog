'use client';

import { shuffle } from 'es-toolkit';
import { useEffect, useState } from 'react';
import { Link } from '@/i18n/navigation';

const descriptions = shuffle([
	'는 코드로 언어를 초월합니다.',
	'는 코드로 세상을 표현하는데 재미를 느낍니다.',
	'는 곡선을 사용하지 않습니다.',
	'는 그림자를 사용하지 않습니다.',
	'는 프로그래밍 언어로 편을 가르지 않습니다.',
	'는 FOMO를 느끼지 않습니다.',
	'는 컴퓨터공학이 재밌다고 믿습니다.',
	'는 하나의 폰트만을 사용합니다.',
	'는 밈 계정이 되고 싶지 않습니다.',
	'는 제품명에 AI가 붙은걸 좋아하지 않습니다.',
	'는 오컴의 면도날을 신봉합니다.',
]);

// TODO: 이게 최선?
const longestDescription = descriptions.reduce((longest, description) =>
	description.length > longest.length ? description : longest,
);

export default function InstagramDescription() {
	const [index, setIndex] = useState(0);

	useEffect(() => {
		const intervalId = setInterval(() => {
			setIndex((prevIndex) => (prevIndex + 1) % descriptions.length);
		}, 1500);

		return () => clearInterval(intervalId);
	}, []);

	return (
		<div className='text-6xl font-extrabold h-dvh w-full flex items-center justify-center'>
			<div className='relative'>
				<p className='absolute top-0 left-0' suppressHydrationWarning>
					<Link
						href='https://instagram.com/yeol.dev'
						className='underline cursor-pointer'
					>
						@yeol.dev
					</Link>
					{descriptions[index]}
				</p>
				<p className='opacity-0'>
					<Link
						href='https://instagram.com/yeol.dev'
						className='underline cursor-pointer'
					>
						@yeol.dev
					</Link>
					{longestDescription}
				</p>
			</div>
		</div>
	);
}

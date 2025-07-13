'use client';

import { useLocale } from 'next-intl';
import { useEffect, useState } from 'react';
import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/utils';

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
		<div className='min-h-[384px] h-full flex items-center justify-center px-16 relative select-none'>
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

export const descriptionsMap: Record<string, string[]> = {
	ko: [
		'는 코드로 언어를 초월합니다.',
		'는 모서리에 곡선을 주지 않습니다.',
		'는 프로그래밍 언어로 편을 가르지 않습니다.',
		'는 최신 기술을 모른다고 겁을 주지 않습니다.',
		'는 기능명에 AI가 붙은걸 꺼립니다.',
		'는 하나의 폰트만을 사용합니다.',
		'는 밈 계정이 아닙니다.',
		'는 코드로 국적을 초월합니다.',
		"는 재밌는걸 '재밌다'고 하지 않습니다.",
		'는 개발이 가끔 힘듭니다.',
		'는 개발이 가끔 즐겁습니다.',
		'는 AI가 잘하는 일도 가끔 직접 합니다.',
		'는 그림자를 사용하지 않습니다.',
		'는 좋은 것보다 나쁜 것이 중요하다 생각합니다.',
		'는 코드로 세상을 표현합니다',
		'는 적당한 폰트 크기를 찾는게 머리 아픕니다.',
		'는 번역이 필요없으면 좋다고 여깁니다.',
		'는 배우는게 즐겁습니다.',
		'는 숨겨진 의미를 좋아합니다.',
		'는 번역가가 되고 싶지 않습니다.',
		'는 하루에 게시물 10개를 올리고 싶지 않습니다.',
		'는 AI가 나보다 코테를 잘풀어도 직접 풉니다.',
		'는 중요하지 않은 코드를 생락합니다',
		"는 싫은걸 '싫다'고 하지 않습니다.",
		'는 한글 게시물과 영어 게시물을 나란히 올리지 않습니다.',
		'는 좋은 비유를 재밌어합니다.',
		'는 vim에서 나가는게 어렵다는 밈을 만들지 않습니다.',
	],
	en: [
		' transcends language through code.',
		' does not round corners.',
		' does not take sides based on programming language.',
		" doesn't shame you for not knowing the latest tech.",
		" is reluctant to slap 'AI' onto every feature name.",
		' uses only one font.',
		' is not a meme account.',
		' goes beyond nationality through code.',
		" doesn't call something 'fun' just because it's fun.",
		' finds development occasionally difficult.',
		' finds development occasionally enjoyable.',
		' sometimes does things manually even when AI excels.',
		' does not use drop shadows.',
		" believes what's bad matters more than what's good.",
		' expresses the world through code.',
		' gets a headache finding the right font size.',
		" thinks it's nice when translation isn't needed.",
		' enjoys learning.',
		' loves hidden meanings.',
		' does not want to become a translator.',
		" doesn't want to post 10 times a day.",
		' solves coding tests personally even if AI beats me.',
		' omits non-important code.',
		" doesn't say 'I hate it' even when hating something.",
		" doesn't post Korean and English posts next to each other.",
		' enjoys good metaphors.',
		" doesn't make a meme about exiting vim.",
	],
};

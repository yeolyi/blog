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
		<div className='min-h-[384px] w-full h-full flex items-center justify-center px-16 relative select-none aspect-video'>
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
				'text-[min(6vw,70px)] leading-[1.375] font-black text-center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-balance w-full',
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
		'는 만국공통어인 코드를 사용합니다.',
		'는 모서리에 곡선을 주지 않습니다.',
		'는 프로그래밍 언어로 편을 가르지 않습니다.',
		'는 최신 기술을 모른다고 겁을 주지 않습니다.',
		'는 하나의 폰트만을 사용합니다.',
		'는 밈 계정이 아닙니다.',
		"는 재밌는걸 '재밌다'고 하지 않습니다.",
		'는 개발이 종종 즐겁습니다.',
		'는 개발이 종종 어렵습니다.',
		'는 AI가 잘하는 일도 가끔 직접 합니다.',
		'는 보더에 그림자를 주지 않습니다.',
		'는 좋은 것보다 나쁜 것이 중요하다 생각합니다.',
		'는 코드로 세상을 표현합니다',
		'는 적당한 폰트 크기를 찾는게 머리 아픕니다.',
		'는 기능명에 AI를 붙이지 않습니다.',
		'는 번역이 필요없으면 좋다고 생각합니다.',
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
		'는 제약이 창의를 만든다고 믿습니다.',
		'는 개발로 1개월만에 수익화하기 비법을 공유하지 않습니다.',
	],
	en: [
		' uses code as a universal language.',
		" doesn't use border radius.",
		" doesn't pick sides with programming languages.",
		" doesn't scare you for not knowing the latest tech.",
		' uses only one font.',
		' is not a meme account.',
		' doesn\'t say "fun" about fun things.',
		' finds development often enjoyable.',
		' finds development often difficult.',
		' sometimes does things manually even when AI excels at them.',
		" doesn't add shadows to borders.",
		' thinks bad things are more important than good things.',
		' expresses the world through code.',
		' finds it headache-inducing to find the right font size.',
		" doesn't add AI to feature names.",
		" thinks it would be nice if translation wasn't needed.",
		' enjoys learning.',
		' likes hidden meanings.',
		" doesn't want to become a translator.",
		" doesn't want to post 10 times a day.",
		' solves coding problems manually even when AI does it better.',
		' omits unimportant code.',
		' doesn\'t say "dislike" about things they dislike.',
		" doesn't post Korean and English posts side by side.",
		' finds good analogies entertaining.',
		" doesn't make memes about vim being hard to exit.",
		' believes constraints create creativity.',
		" doesn't share secrets for monetizing development in one month.",
	],
};

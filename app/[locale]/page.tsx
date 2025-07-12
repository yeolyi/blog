import dayjs from 'dayjs';
import type { StaticImageData } from 'next/image';
import Image from 'next/image';
import type { Locale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getSubscriberCount } from '@/actions/resend';
import DecimalToBinary from '@/components/cs/DecimalToBinary';
import EmailSubscribe from '@/components/cs/EmailSubscribe';
import Flow from '@/components/cs/flow';
import PixelateImage from '@/components/cs/PixelateImage';
import TruthTable from '@/components/cs/TruthTable';
import InstagramDescription from '@/components/InstagramDescription';
import Marquee from '@/components/Marquee';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from '@/components/ui/carousel';
import { Separator } from '@/components/ui/separator';
import { Link } from '@/i18n/navigation';
import not from '@/mdx/cs/nand-is-all-you-need/assets/not.json';
import AddingTuringMachine from '@/mdx/cs/turing-machine/components/AddingTuringMachine';
import { order } from '@/mdx/react';
import { getMdxIds } from '@/utils/path';
import me from './assets/me.jpg';
import meme1 from './assets/meme1.jpeg';
import meme2 from './assets/meme2.png';
import meme3 from './assets/meme3.jpeg';
import meme4 from './assets/meme4.png';

export type PostType = {
	titleKey: string;
	title?: string;
	descriptionKey?: string;
	description?: string;
} & (
	| {
			isPublished: false;
	  }
	| {
			isPublished: true;
			slug: string;
	  }
);

export type PartType = {
	id: string;
	titleKey: string;
	title?: string;
	image?: StaticImageData;
	posts: PostType[];
};

export default async function Home({
	params,
}: {
	params: Promise<{ locale: Locale }>;
}) {
	const { locale } = await params;
	// Enable static rendering
	setRequestLocale(locale);

	const tCS = await getTranslations('Curriculum');
	const tMain = await getTranslations('MainPage');

	const ids = await getMdxIds(locale);

	const arr: { href: string; title: string; date: string }[] = await Promise.all(
		ids.map(async (id) => {
			const { default: _, ...metadata } = await import(
				`@/mdx/${id}/${locale}.mdx`
			);
			return { href: `/post/${id}`, ...metadata };
		}),
	);

	if (locale === 'ko') {
		arr.push({
			href: '/react/setup',
			title: tMain('reactSetupTitle'),
			date: '2025-05-23',
		});
		arr.push({
			href: '/cs/zero-and-one',
			title: tMain('csZeroOneTitle'),
			date: '2025-05-04',
		});
	}

	const sortedArr = arr.sort((a, b) => {
		return new Date(b.date).getTime() - new Date(a.date).getTime();
	});

	const subscriberCount = await getSubscriberCount();
	const count = subscriberCount.success ? subscriberCount.value : undefined;

	const metadataList = await Promise.all(
		order.map(async (id) => {
			const { default: _, ...metadata } = await import(`@/mdx/react/${id}/ko.mdx`);
			return { id, ...metadata };
		}),
	);

	return (
		<div className='px-4 flex flex-col gap-7 max-w-6xl mx-auto'>
			<div className='flex flex-col gap-7 md:flex-row'>
				<Image
					src={me}
					alt=''
					placeholder='blur'
					className='object-cover w-full h-full aspect-square not-prose md:w-1/2'
				/>
				<div className='flex flex-col gap-7 md:w-1/2'>
					<p>{tMain('title')}</p>
					<p>
						{tMain.rich('developerBio', {
							snuLink: (chunks) => (
								<LinkButton href='https://snu.ac.kr'>{chunks}</LinkButton>
							),
							kakaoLink: (chunks) => (
								<LinkButton href='https://kakaocorp.com'>{chunks}</LinkButton>
							),
							cseLink: (chunks) => (
								<LinkButton href='https://cse.snu.ac.kr'>{chunks}</LinkButton>
							),
							baekjoonLink: (chunks) => (
								<LinkButton href='https://solved.ac/profile/yeolyii'>
									{chunks}
								</LinkButton>
							),
							skyonLink: (chunks) => <LinkButton>{chunks}</LinkButton>,
							githubLink: (chunks) => (
								<LinkButton href='https://instagram.com/yeol.dev'>{chunks}</LinkButton>
							),
						})}
					</p>
					<p>
						{tMain.rich('creatorBio', {
							instagramLink: (chunks) => (
								<LinkButton href='https://instagram.com/yeol.dev'>{chunks}</LinkButton>
							),
							csLink: (chunks) => <LinkButton href='#cs'>{chunks}</LinkButton>,
						})}
					</p>
				</div>
			</div>

			<Separator />

			<div className='flex flex-wrap'>
				{sortedArr.map(({ href, title, date }) => (
					<Button
						asChild
						variant='ghost'
						key={href}
						className='pl-0 max-w-full overflow-hidden'
					>
						<Link href={href} key={href} className='block'>
							<h3 className='truncate'>{title}</h3>
							<span className='text-muted-foreground'>
								{dayjs(date).format('YYYY MM')}
							</span>
						</Link>
					</Button>
				))}
			</div>
			<Separator />
			<div className='aspect-video text-[min(6vw,70px)] leading-none font-black text-stone-200 dark:text-stone-700 select-none overflow-hidden break-all text-justify'>
				{'NAND IS MORE THAN JUST '.repeat(4)}
				<span className='text-black dark:text-white'>
					NAND IS MORE THAN JUST NAND{' '}
				</span>
				IS MORE THAN JUST {'NAND IS MORE THAN JUST '.repeat(5)} NAND
			</div>
			<Carousel opts={{ loop: true, align: 'start' }}>
				<CarouselContent className='-pl-4'>
					<CarouselItem className='max-w-sm pl-4'>
						<TruthTable
							description={tMain('andGate')}
							labels={[
								{ label: 'A', type: 'input' },
								{ label: 'B', type: 'input' },
								{ label: 'A AND B', type: 'output' },
							]}
							data={[
								[false, false, false],
								[false, true, false],
								[true, false, false],
								[true, true, true],
							]}
						/>
					</CarouselItem>
					<CarouselItem className='max-w-sm pl-4'>
						<Card>
							<CardHeader>
								<CardTitle>{tMain('nandUniversality')}</CardTitle>
								<CardDescription>{tMain('nandToNot')}</CardDescription>
							</CardHeader>
							<Flow id='/cs' initialJSON={not} height={250} hideNodeButtons />
						</Card>
					</CarouselItem>
					<CarouselItem className='pl-4 max-w-md'>
						<AddingTuringMachine />
					</CarouselItem>
					<CarouselItem className='max-w-sm pl-4'>
						<DecimalToBinary />
					</CarouselItem>
				</CarouselContent>
				<CarouselNext />
				<CarouselPrevious />
			</Carousel>
			<div className='flex flex-col gap-7'>
				<p className='w-full max-w-2xl'>{tMain('csIntro')}</p>

				{count !== undefined && (
					<p>
						<span className='font-extrabold'>{count.toLocaleString()}</span>
						{tMain('subscriberCount')}
					</p>
				)}

				<EmailSubscribe />

				<p className='font-extrabold'>「{tCS('part1Title')}」</p>

				<p>
					<GhostButton href='/cs/zero-and-one'>{tCS('hw1Title')}</GhostButton>
					<GhostButton href='/cs/and-or-not'>{tCS('hw2Title')}</GhostButton>
					<GhostButton href='/cs/nand-is-all-you-need'>
						{tCS('hw3Title')}
					</GhostButton>
					<GhostButton href='/cs/adder'>{tCS('hw4Title')}</GhostButton>
					<GhostButton href='/cs/sequential'>{tCS('hw5Title')}</GhostButton>
					<GhostButton href='/cs/turing-machine'>{tCS('hw6Title')}</GhostButton>
					<GhostButton>{tCS('hw7Title')}</GhostButton>
					<GhostButton>{tCS('hw8Title')}</GhostButton>
					<GhostButton>{tCS('hw9Title')}</GhostButton>
				</p>

				<p className='font-extrabold'>「{tCS('part2Title')}」</p>

				<p>
					<GhostButton>{tCS('ds1Title')}</GhostButton>
					<GhostButton>{tCS('ds2Title')}</GhostButton>
					<GhostButton>{tCS('ds3Title')}</GhostButton>
					<GhostButton>{tCS('ds4Title')}</GhostButton>
					<GhostButton>{tCS('ds5Title')}</GhostButton>
					<GhostButton>{tCS('ds6Title')}</GhostButton>
					<GhostButton>{tCS('ds7Title')}</GhostButton>
				</p>

				<p className='font-extrabold'>「{tCS('part3Title')}」</p>

				<p>
					<GhostButton>{tCS('os1Title')}</GhostButton>
					<GhostButton>{tCS('os2Title')}</GhostButton>
					<GhostButton>{tCS('os3Title')}</GhostButton>
					<GhostButton>{tCS('os4Title')}</GhostButton>
					<GhostButton>{tCS('os5Title')}</GhostButton>
					<GhostButton>{tCS('os6Title')}</GhostButton>
				</p>
			</div>

			<Separator />

			<InstagramDescription />

			<Carousel opts={{ loop: true, align: 'start' }}>
				<CarouselContent className='-pl-4'>
					<CarouselItem className='pl-4 aspect-[4/5] max-w-sm'>
						<Image
							src={meme1}
							alt=''
							placeholder='blur'
							className='w-full h-full object-cover'
						/>
					</CarouselItem>
					<CarouselItem className='pl-4 aspect-[4/5] max-w-sm'>
						<video
							src='/main/merge-sort.webm'
							autoPlay
							muted
							loop
							className='w-full h-full object-cover'
						/>
					</CarouselItem>
					<CarouselItem className='pl-4 aspect-[4/5] max-w-sm'>
						<Image
							src={meme2}
							alt=''
							placeholder='blur'
							className='w-full h-full object-cover'
						/>
					</CarouselItem>
					<CarouselItem className='pl-4 aspect-[4/5] max-w-sm'>
						<Image
							src={meme3}
							alt=''
							placeholder='blur'
							className='w-full h-full object-cover'
						/>
					</CarouselItem>
					<CarouselItem className='pl-4 aspect-[4/5] max-w-sm'>
						<Image
							src={meme4}
							alt=''
							placeholder='blur'
							className='w-full h-full object-cover'
						/>
					</CarouselItem>
				</CarouselContent>
				<CarouselNext />
				<CarouselPrevious />
			</Carousel>

			<p className='w-full max-w-2xl'>
				{tMain.rich('instagramIntro', {
					externalLink: (chunks) => (
						<LinkButton href='https://minguhongmfg.com/about'>{chunks}</LinkButton>
					),
				})}
			</p>

			<Separator />

			<div className='aspect-video flex items-center justify-center select-none'>
				<p className='text-[min(6vw,70px)] leading-none font-extrabold text-center'>
					<span className='opacity-10'>performWorkUntilDeadline</span>
					<br />
					<span className='opacity-30'>renderRootSync</span>
					<br />
					<span className='opacity-50'>workLoopSync</span>
					<br />
					<span className='opacity-70'>updateFunctionComponent</span>
					<br />
					<span className='opacity-90'>renderWithHooks</span>
					<br />
					...&lt;App /&gt;
				</p>
			</div>

			<div className='max-w-2xl space-y-7'>
				<p>
					가장 많이 쓰는 라이브러리가 리액트인데 그만큼 깊게 이해하고 있는 것 같지는
					않아 리액트 소스코드를 공부하기로 했습니다. 어떤 개발자분 소개에 '리액트
					컨트리뷰터'가 있는게 멋져보이기도 했고요.
				</p>
				<p>
					<LinkButton href='https://jser.dev/series/react-source-code-walkthrough'>
						React source code deep dive 시리즈
					</LinkButton>
					의 도움을 많이 받았습니다. 자료의 커리큘럼을 따라 리액트 코드를 살펴보면서
					스스로 이해한 과정과 따로 찾아본 내용들을 기록했습니다.
				</p>
			</div>

			<div className='flex flex-col gap-7'>
				<p className='font-extrabold'>「시작하기 앞서」</p>
				<p>
					{metadataList.slice(0, 2).map(({ id, title }) => (
						<GhostButton href={`/react/${id}`} key={id}>
							{title}
						</GhostButton>
					))}
				</p>
				<p className='font-extrabold'>「처음 UI를 그리는 과정」</p>
				<p>
					{metadataList.slice(2, 10).map(({ id, title }) => (
						<GhostButton href={`/react/${id}`} key={id}>
							{title}
						</GhostButton>
					))}
				</p>
				<p className='font-extrabold'>「UI를 다시 그리는 과정」</p>
				<p>
					{metadataList.slice(10, 15).map(({ id, title }) => (
						<GhostButton href={`/react/${id}`} key={id}>
							{title}
						</GhostButton>
					))}
				</p>
				<p className='font-extrabold'>「리액트 훅 뜯어보기」</p>
				<p>
					{metadataList.slice(15).map(({ id, title }) => (
						<GhostButton href={`/react/${id}`} key={id}>
							{title}
						</GhostButton>
					))}
				</p>
			</div>
		</div>
	);
}

const LinkButton = ({
	href,
	children,
}: {
	href?: string;
	children: React.ReactNode;
}) => {
	return (
		<Button
			variant='secondary'
			className='h-6 pl-1 pr-6 max-w-full overflow-hidden'
			asChild={!!href}
			disabled={!href}
		>
			{href ? (
				<Link href={href} className='truncate'>
					{children}
				</Link>
			) : (
				<span className='truncate'>{children}</span>
			)}
		</Button>
	);
};

const GhostButton = ({
	href,
	children,
}: {
	href?: string;
	children: React.ReactNode;
}) => {
	return (
		<Button
			variant='ghost'
			className='max-w-full pl-0 pr-6 overflow-hidden'
			asChild={!!href}
			disabled={!href}
		>
			{href ? (
				<Link href={href} className='truncate'>
					{children}
				</Link>
			) : (
				<span className='truncate'>{children}</span>
			)}
		</Button>
	);
};

/*
	<Code
				template='react'
				files={{
					'App.js': `import { useState } from 'react';

function Link() {
  return <a href="https://yeolyi.com">yeolyi.com</a>;
}

function Component() {
  const [count, setCount] = useState(0);
  return (
    <div>
    <button onClick={() => setCount((count) => count + 1)}>
      click me - {count} 
    </button> ({count % 2 === 0 ? <span>even</span> : <b>odd</b>})
    </div>
  );
}

export default function App() {
  return (
    <div>
      <Link />
      <br />
      <Component />
    </div>
  );
}`,
				}}
			/>
*/

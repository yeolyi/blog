import dayjs from 'dayjs';
import {
	ChevronDown,
	ChevronRight,
	Construction,
	ExternalLink,
	Info,
} from 'lucide-react';
import type { StaticImageData } from 'next/image';
import Image from 'next/image';
import type { Locale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getInstagramFollowers } from '@/actions/instagram';
import { getSubscriberCount } from '@/actions/resend';
import CraftTypography from '@/app/[locale]/components/CraftSlot';
import CSTypography from '@/app/[locale]/components/CSTypography';
import InstagramDescription from '@/app/[locale]/components/InstagramDescription';
import Flow from '@/components/cs/flow';
import TruthTable from '@/components/cs/TruthTable';
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
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Separator } from '@/components/ui/separator';
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import { Link } from '@/i18n/navigation';
import DecimalToBinary from '@/mdx/cs/adder/components/DecimalToBinary';
import not from '@/mdx/cs/nand-is-all-you-need/assets/not.json';
import AddingTuringMachine from '@/mdx/cs/turing-machine/components/AddingTuringMachine';
import { getMdxIds } from '@/utils/path';
import cs from './assets/cs.gif';
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

	const tMain = await getTranslations('MainPage');

	const subscriberCount = await getSubscriberCount();
	const count = subscriberCount.success ? subscriberCount.value : undefined;

	const instagramFollowers = await getInstagramFollowers();
	const followersCount = instagramFollowers.success
		? instagramFollowers.value.followers_count
		: undefined;

	const postIds = await getMdxIds(locale);
	const postArr: { href: string; title: string; date: string }[] = (
		await Promise.all(
			postIds.map(async (id) => {
				const { default: _, ...metadata } = await import(
					`@/mdx/${id}/${locale}.mdx`
				);
				return { href: `/post/${id}`, ...metadata };
			}),
		)
	).toSorted((a, b) => {
		return new Date(b.date).getTime() - new Date(a.date).getTime();
	});

	return (
		<div className='px-4 flex flex-col gap-7 max-w-6xl mx-auto'>
			<div className='flex flex-col gap-7 md:flex-row'>
				<Image
					src={me}
					alt=''
					placeholder='blur'
					className='object-cover w-full h-full aspect-square md:w-1/2'
					loading='eager'
					quality={100}
					width={1024}
					height={1024}
				/>
				<div className='flex-col gap-7 hidden md:flex md:w-1/2'>
					<p>{tMain('title')}</p>
					<About />
				</div>
				<Collapsible className='md:hidden'>
					<CollapsibleTrigger className='flex items-center justify-between group'>
						<p>{tMain('title')}</p>
						<ChevronDown className='w-4 h-4 ml-1 group-data-[state=open]:rotate-180' />
					</CollapsibleTrigger>
					<CollapsibleContent className='flex flex-col gap-7 mt-7'>
						<About />
					</CollapsibleContent>
				</Collapsible>
			</div>

			<Separator />

			<div className='flex flex-wrap'>
				{postArr.map(({ href, title, date }) => (
					<Button
						asChild
						variant='ghost'
						key={href}
						className='max-w-full overflow-hidden'
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

			<CSTypography />

			<div className='flex flex-col gap-7'>
				<p className='w-full max-w-2xl'>
					{tMain('csIntro')}{' '}
					{count !== undefined && (
						<>
							<span className='font-extrabold'>{count.toLocaleString()}</span>
							{tMain('subscriberCount')}
						</>
					)}
				</p>
			</div>

			<Button asChild className='w-fit self-end'>
				<Link href='/cs'>
					보러가기
					<ChevronRight />
				</Link>
			</Button>

			<Separator />

			<Carousel opts={{ loop: true, align: 'start' }}>
				<CarouselContent className='-pl-4'>
					<CarouselItem className='pl-4 basis-11/12'>
						<InstagramDescription />
					</CarouselItem>
					<CarouselItem className='pl-4 aspect-[4/5] max-w-sm'>
						<Image
							src={meme1}
							alt=''
							placeholder='blur'
							className='w-full h-full object-contain'
						/>
					</CarouselItem>
					<CarouselItem className='pl-4 aspect-[4/5] max-w-sm'>
						<video
							src='/main/merge-sort.webm'
							autoPlay
							muted
							loop
							playsInline
							className='w-full h-full object-contain'
						/>
					</CarouselItem>
					<CarouselItem className='pl-4 aspect-[4/5] max-w-sm'>
						<Image
							src={meme2}
							alt=''
							placeholder='blur'
							className='w-full h-full object-contain'
						/>
					</CarouselItem>
					<CarouselItem className='pl-4 aspect-[4/5] max-w-sm'>
						<Image
							src={meme3}
							alt=''
							placeholder='blur'
							className='w-full h-full object-contain'
						/>
					</CarouselItem>
					<CarouselItem className='pl-4 aspect-[4/5] max-w-sm'>
						<Image
							src={meme4}
							alt=''
							placeholder='blur'
							className='w-full h-full object-contain'
						/>
					</CarouselItem>
				</CarouselContent>
				<CarouselNext />
				<CarouselPrevious />
			</Carousel>

			<div className='w-full max-w-2xl flex items-center gap-1'>
				<p>
					{tMain.rich('instagramIntro', {
						externalLink: (chunks) => (
							<LinkButton href='https://minguhongmfg.com/about'>{chunks}</LinkButton>
						),
					})}{' '}
					{followersCount !== undefined && (
						<>
							<span className='font-extrabold'>{followersCount.toLocaleString()}</span>
							{tMain('subscriberCount')}
						</>
					)}
				</p>
				<Tooltip>
					<TooltipTrigger>
						<Info className='w-4 h-4' />
					</TooltipTrigger>
					<TooltipContent>
						<p>
							<a
								href='https://minguhongmfg.com/about'
								className='underline'
								target='_blank'
								rel='noreferrer noopener'
							>
								민구홍 매뉴팩처링
							</a>
							에서 아이디어를 얻어 <br />
							계정이 하는 일들과 마음에 들었던 컨텐츠들을 공유합니다.
						</p>
					</TooltipContent>
				</Tooltip>
			</div>

			<Button asChild className='w-fit self-end'>
				<Link
					href='https://instagram.com/yeol.dev'
					target='_blank'
					rel='noreferrer noopener'
				>
					보러가기
					<ExternalLink />
				</Link>
			</Button>

			<Separator />

			<div className='aspect-video flex items-center justify-center select-none min-h-[384px] w-full'>
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

			<div className='max-w-2xl '>
				<p>
					사내 스터디에서 리액트 소스코드를 직접 뜯어봅니다.{' '}
					<LinkButton href='https://jser.dev/series/react-source-code-walkthrough'>
						jser.dev
					</LinkButton>
					의 도움을 많이 받았습니다.
				</p>
			</div>

			<Button asChild className='w-fit self-end'>
				<Link href='/react'>
					보러가기
					<ChevronRight />
				</Link>
			</Button>

			<Separator />

			<CraftTypography />
			<div className='max-w-2xl'>
				<p>만든 것들을 소개합니다.</p>
			</div>
			<Button className='w-fit self-end' disabled>
				준비중
				<Construction />
			</Button>
		</div>
	);
}

const About = async () => {
	const tMain = await getTranslations('MainPage');

	return (
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
					<LinkButton href='https://solved.ac/profile/yeolyii'>{chunks}</LinkButton>
				),
				skyonLink: (chunks) => <LinkButton>{chunks}</LinkButton>,
				githubLink: (chunks) => (
					<LinkButton href='https://instagram.com/yeol.dev'>{chunks}</LinkButton>
				),
			})}
		</p>
	);
};

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
			className='h-6 max-w-full overflow-hidden'
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

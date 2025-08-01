import dayjs from 'dayjs';
import { ChevronRight, Construction, ExternalLink, Info } from 'lucide-react';
import type { StaticImageData } from 'next/image';
import Image from 'next/image';
import type { Locale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Suspense } from 'react';
import CraftTypography from '@/app/[locale]/components/CraftSlot';
import CSTypography from '@/app/[locale]/components/CSTypography';
import InstagramDescription from '@/app/[locale]/components/InstagramDescription';
import InstagramFollowerCount from '@/app/[locale]/components/InstagramFollowerCount';
import SubscriberCount from '@/app/[locale]/components/SubscriberCount';
import { Button } from '@/components/ui/button';
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from '@/components/ui/carousel';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { Link } from '@/i18n/navigation';
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

	const tMain = await getTranslations('MainPage');

	const postIds = await getMdxIds(locale, 'post');
	const postArr: { href: string; title: string; date: string }[] = (
		await Promise.all(
			postIds.map(async (id) => {
				const { default: _, ...metadata } = await import(
					`@/mdx/post/${id}/${locale}.mdx`
				);
				return { href: `/post/${id}`, ...metadata };
			}),
		)
	).toSorted((a, b) => {
		return new Date(b.date).getTime() - new Date(a.date).getTime();
	});

	return (
		<div className='px-6 flex flex-col gap-7 max-w-6xl mx-auto mt-7'>
			<div className='flex flex-col gap-7 md:flex-row'>
				{/* wrapper가 꼭 필요한건가?? */}
				<div className='relative aspect-square md:w-1/2'>
					<Image
						src={me}
						alt=''
						fill
						placeholder='blur'
						className='object-cover'
						loading='eager'
						quality={75}
					/>
				</div>
				<p className='whitespace-pre-wrap md:w-1/2'>
					{tMain.rich('bio', {
						name: (chunks) => <span className='font-extrabold'>{chunks}</span>,
						role: (chunks) => <span className='text-muted-foreground'>{chunks}</span>,
						br: () => <br />,
					})}
				</p>
			</div>

			<Separator />

			<div className='flex flex-wrap -ml-4'>
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
				<p className='w-full max-w-3xl'>
					{tMain('csIntro')}{' '}
					<Suspense fallback={<span>-</span>}>
						<span className='font-extrabold'>
							<SubscriberCount />
						</span>
					</Suspense>
					{tMain('subscriberCount')}
				</p>
			</div>

			<Button asChild className='w-fit self-end'>
				<Link href='/cs'>
					{tMain('viewMore')}
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

			<p>
				{tMain('instagramIntro')}{' '}
				<span className='font-extrabold'>
					<InstagramFollowerCount />
				</span>
				{tMain('subscriberCount')}{' '}
				<Popover>
					<PopoverTrigger className='align-middle -translate-y-0.5'>
						<Info className='w-4 h-4' />
					</PopoverTrigger>
					<PopoverContent>
						<p>
							{tMain.rich('instagramDescription', {
								externalLink: (chunks) => (
									<a
										href='https://minguhongmfg.com/about'
										className='underline'
										target='_blank'
										rel='noreferrer noopener'
									>
										{chunks}
									</a>
								),
							})}
						</p>
					</PopoverContent>
				</Popover>
			</p>

			<Button asChild className='w-fit self-end'>
				<Link
					href='https://instagram.com/yeol.dev'
					target='_blank'
					rel='noreferrer noopener'
				>
					{tMain('viewMore')}
					<ExternalLink />
				</Link>
			</Button>

			<Separator />

			<div className='aspect-video flex items-center justify-center min-h-[384px] w-full'>
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

			<div className='max-w-3xl'>
				<p>
					{tMain('reactIntro')}{' '}
					<Button
						variant='secondary'
						className='h-6 max-w-full overflow-hidden'
						asChild
					>
						<Link
							href='https://jser.dev/series/react-source-code-walkthrough'
							className='truncate'
							target='_blank'
							rel='noreferrer noopener'
						>
							jser.dev
						</Link>
					</Button>
					{tMain('reactHelper')}
				</p>
			</div>

			<Button asChild className='w-fit self-end'>
				<Link href='/react'>
					{tMain('viewMore')}
					<ChevronRight />
				</Link>
			</Button>

			<Separator />

			<CraftTypography />
			<div className='max-w-3xl'>
				<p>{tMain('craftIntro')}</p>
			</div>
			<Button className='w-fit self-end' disabled>
				{tMain('comingSoon')}
				<Construction />
			</Button>
		</div>
	);
}

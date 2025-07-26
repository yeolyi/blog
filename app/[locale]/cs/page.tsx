import { getTranslations } from 'next-intl/server';
import { Suspense } from 'react';
import CSTypography from '@/app/[locale]/components/CSTypography';
import SubscriberCount from '@/app/[locale]/components/SubscriberCount';
import EmailSubscribe from '@/app/[locale]/cs/components/EmailSubscribe';
import AppearAnimation from '@/components/AppearAnimation';
import Flow from '@/components/cs/flow';
import { Card } from '@/components/ui/card';
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from '@/components/ui/carousel';
import { Separator } from '@/components/ui/separator';
import { Link } from '@/i18n/navigation';
import ripple from '@/mdx/cs/adder/assets/ripple.json';
import { VonNeumannSimulator } from '@/mdx/cs/von-neumann/components/VonNeumannSimulator';
import PixelateImage from '@/mdx/cs/zero-and-one/components/PixelateImage';

export default async function CS() {
	const tMain = await getTranslations('MainPage');
	const tCS = await getTranslations('CS');

	return (
		<AppearAnimation asChild>
			<div className='px-6 mx-auto flex flex-col gap-7 max-w-6xl'>
				<CSTypography />

				<p>{tCS('intro')}</p>
				<p>
					<span className='font-extrabold'>
						<Suspense fallback='-'>
							<SubscriberCount />
						</Suspense>
					</span>
					{tMain('subscriberCount')}
				</p>

				<EmailSubscribe />

				<Separator />

				<p>{tCS('demoDescription')}</p>

				<Carousel opts={{ loop: true, align: 'start' }}>
					<CarouselContent className='-pl-4'>
						<CarouselItem className='max-w-md pl-4 '>
							<PixelateImage />
						</CarouselItem>
						<CarouselItem className='max-w-md pl-4'>
							<Card className='p-0'>
								<Flow id='/cs' initialJSON={ripple} hideNodeButtons height={400} />
							</Card>
						</CarouselItem>
						<CarouselItem className='max-w-md pl-4 '>
							<VonNeumannSimulator hideHeader />
						</CarouselItem>
					</CarouselContent>
					<CarouselNext />
					<CarouselPrevious />
				</Carousel>

				<Separator />

				<p className='font-extrabold'>「{tCS('part1Title')}」</p>

				<div className='flex flex-col gap-2 [&>p]:text-muted-foreground [&>a]:hover:underline'>
					<Link href='/cs/zero-and-one'>{tCS('hw1Title')}</Link>
					<Link href='/cs/and-or-not'>{tCS('hw2Title')}</Link>
					<Link href='/cs/nand-is-all-you-need'>{tCS('hw3Title')}</Link>
					<Link href='/cs/adder'>{tCS('hw4Title')}</Link>
					<Link href='/cs/sequential'>{tCS('hw5Title')}</Link>
					<Link href='/cs/turing-machine'>{tCS('hw6Title')}</Link>
					<Link href='/cs/von-neumann'>{tCS('hw7Title')}</Link>
					<p>{tCS('hw8Title')}</p>
					<p>{tCS('hw9Title')}</p>
				</div>

				<p className='font-extrabold'>「{tCS('part2Title')}」</p>

				<div className='flex flex-col gap-2 [&>p]:text-muted-foreground'>
					<p>{tCS('ds1Title')}</p>
					<p>{tCS('ds2Title')}</p>
					<p>{tCS('ds3Title')}</p>
					<p>{tCS('ds4Title')}</p>
					<p>{tCS('ds5Title')}</p>
					<p>{tCS('ds6Title')}</p>
					<p>{tCS('ds7Title')}</p>
				</div>

				<p className='font-extrabold'>「{tCS('part3Title')}」</p>

				<div className='flex flex-col gap-2 [&>p]:text-muted-foreground'>
					<p>{tCS('os1Title')}</p>
					<p>{tCS('os2Title')}</p>
					<p>{tCS('os3Title')}</p>
					<p>{tCS('os4Title')}</p>
					<p>{tCS('os5Title')}</p>
					<p>{tCS('os6Title')}</p>
				</div>
			</div>
		</AppearAnimation>
	);
}

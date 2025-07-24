import { getTranslations } from 'next-intl/server';
import { Suspense } from 'react';
import CSTypography from '@/app/[locale]/components/CSTypography';
import SubscriberCount from '@/app/[locale]/components/SubscriberCount';
import EmailSubscribe from '@/app/[locale]/cs/components/EmailSubscribe';
import AppearAnimation from '@/components/AppearAnimation';
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
import { Link } from '@/i18n/navigation';
import DecimalToBinary from '@/mdx/cs/adder/components/DecimalToBinary';
import not from '@/mdx/cs/nand-is-all-you-need/assets/not.json';
import AddingTuringMachine from '@/mdx/cs/turing-machine/components/AddingTuringMachine';

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

				<p>{tCS('demoDescription')}</p>

				<Carousel opts={{ loop: true, align: 'start' }}>
					<CarouselContent className='-pl-4'>
						<CarouselItem className='pl-4 max-w-sm'>
							<TruthTable
								description={tCS('andGate')}
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
									<CardTitle>{tCS('nandUniversality')}</CardTitle>
									<CardDescription>{tCS('nandToNot')}</CardDescription>
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
					<GhostButton href='/cs/von-neumann'>{tCS('hw7Title')}</GhostButton>
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
		</AppearAnimation>
	);
}

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
			asChild={!!href}
			disabled={!href}
			className='max-w-full'
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

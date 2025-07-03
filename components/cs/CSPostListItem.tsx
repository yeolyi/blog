import clsx from 'clsx';
import { ArrowRightIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Link } from '@/i18n/navigation';

export default function CSPostListItem(
	props:
		| {
				href: string;
				title: string;
				description: string;
				date?: string;
				children: React.ReactNode;
		  }
		| {
				title: string;
				description: string;
				date?: string;
		  },
) {
	const t = useTranslations('Curriculum');

	const { title, description, date } = props;

	// TODO: 이게 최선?
	const href = 'href' in props ? props.href : undefined;
	const children = 'children' in props ? props.children : null;

	return (
		<div className={clsx('flex flex-col gap-4')}>
			{children}
			<div className='flex flex-col gap-2'>
				<h3
					className={clsx(
						'm-0 p-0 break-keep text-lg',
						href ? 'text-foreground' : 'text-muted-foreground',
					)}
				>
					{!href && (
						<Badge variant='secondary' className='mr-1'>
							{t('comingSoon')}
						</Badge>
					)}
					{title}
				</h3>
				<p
					className={clsx(
						'm-0 p-0 font-light text-base',
						href ? 'text-foreground' : 'text-muted-foreground',
					)}
				>
					{description}
					{'  '}
				</p>
				{date && href && (
					<div className='flex items-center gap-6 justify-between'>
						<span className='text-muted-foreground'>
							{` ${t('dateFormat', { date: new Date(date) })}`}
						</span>
					</div>
				)}
			</div>
			{href && (
				<Button asChild variant='secondary' className='ml-auto'>
					<Link href={href} className='no-underline'>
						{t('viewPost')}
						<ArrowRightIcon />
					</Link>
				</Button>
			)}
			<Separator />
		</div>
	);
}

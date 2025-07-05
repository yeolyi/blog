'use client';

import clsx from 'clsx';
import { ChevronLeft, ChevronRight, List } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/navigation';

export default function PostNavigation({
	id,
	subDir,
	className,
	order,
	listHref,
}: {
	id: string;
	subDir: string;
	className?: string;
	order: string[];
	listHref?: string;
}) {
	const t = useTranslations('PostNavigation');

	const currentIndex = order.indexOf(id);
	const prevPostIndex = currentIndex > 0 ? currentIndex - 1 : null;
	const nextPostIndex =
		currentIndex < order.length - 1 ? currentIndex + 1 : null;

	const prevPostId = prevPostIndex !== null ? order[prevPostIndex] : null;
	const nextPostId = nextPostIndex !== null ? order[nextPostIndex] : null;

	return (
		<div className={clsx('flex gap-2 justify-between pt-21', className)}>
			{prevPostId ? (
				<Button asChild variant='ghost'>
					<Link href={`/${subDir}/${prevPostId}`}>
						<ChevronLeft size={16} />
						<span>{t('prev')}</span>
					</Link>
				</Button>
			) : (
				// TODO 나은 방법
				<Button variant='ghost' className='text-transparent' disabled>
					<ChevronLeft size={16} />
					<span>{t('prev')}</span>
				</Button>
			)}

			<Button asChild variant='ghost'>
				<Link href={listHref || `/${subDir}`}>
					<List size={16} />
					{t('backToList')}
				</Link>
			</Button>

			{nextPostId ? (
				<Button asChild variant='default'>
					<Link href={`/${subDir}/${nextPostId}`}>
						<span>{t('next')}</span>
						<ChevronRight size={16} />
					</Link>
				</Button>
			) : (
				<Button variant='ghost' className='text-transparent' disabled>
					<span>{t('next')}</span>
					<ChevronRight size={16} />
				</Button>
			)}
		</div>
	);
}

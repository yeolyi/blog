'use client';

import { useTranslations } from 'next-intl';
import AppearAnimation from '@/components/AppearAnimation';
import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/navigation';

export default function PostNotFound() {
	const t = useTranslations('NotFound');

	return (
		<AppearAnimation asChild>
			<div className='mdx'>
				<h1>404 Not Found</h1>
				<Button asChild variant='secondary' className='w-fit'>
					<Link href='/'>{t('backHome')}</Link>
				</Button>
			</div>
		</AppearAnimation>
	);
}

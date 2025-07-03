import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

export default function Footer() {
	const t = useTranslations('Footer');

	return (
		<footer className='p-6 flex flex-wrap mx-auto gap-3'>
			<p className='text-muted-foreground whitespace-pre text-xs'>
				<Link href='/' className='text-foreground font-bold no-underline text-xl'>
					{t('title')}
				</Link>
				{'   '}
				{t('copyright', { year: new Date().getFullYear() })}
			</p>
		</footer>
	);
}

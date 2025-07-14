'use client';

import { Send } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRef, useState } from 'react';
import { toast } from 'sonner';
import { subscribeEmail } from '@/actions/resend';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { confetti } from '@/utils/confetti';

export default function EmailSubscribe() {
	const t = useTranslations('EmailSubscribe');
	const ref = useRef<HTMLButtonElement>(null);
	const [email, setEmail] = useState('');

	const onSubmit = async () => {
		const result = await subscribeEmail(email);
		if (!result.success) {
			toast.error(result.value);
			return '';
		}

		const rect = ref.current?.getBoundingClientRect();
		if (rect) {
			confetti({
				origin: {
					x: 0.5,
					y: (rect.y + rect.height) / window.innerHeight,
				},
				colors: ['#FFD60A', '#FF375F', '#32D74B', '#0A84FF', '#FF9F0A'],
			});
		}

		setEmail('');
	};

	return (
		<div className='flex gap-3'>
			<Input
				title={'email'}
				type='email'
				name='email'
				placeholder={t('emailPlaceholder')}
				required
				className='max-w-xs'
				value={email}
				onChange={(e) => setEmail(e.target.value)}
				onKeyDown={(e) => {
					if (e.key === 'Enter') {
						onSubmit();
					}
				}}
			/>

			<Button type='button' ref={ref} onClick={onSubmit}>
				<Send />
				{t('subscribeButton')}
			</Button>
		</div>
	);
}

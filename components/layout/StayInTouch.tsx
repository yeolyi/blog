import { Instagram } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function StayInTouch({ className }: { className?: string }) {
	return (
		<div className={cn('p-6 bg-stone-50 dark:bg-stone-900', className)}>
			<h3 className='text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100'>
				Stay in touch
			</h3>
			<p className='text-gray-700 dark:text-gray-300 mb-4 leading-relaxed'>
				Never miss a single post or a project announcement I make. Follow me on
				Twitter to stay in touch, ask a question, or just discuss different
				engineering topics together.
			</p>
			<Button
				asChild
				size='lg'
				className='bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] text-white'
			>
				<a
					href='https://twitter.com/leoyidev'
					target='_blank'
					rel='noopener noreferrer'
				>
					<Instagram size={20} />
					Instagram
				</a>
			</Button>
		</div>
	);
}

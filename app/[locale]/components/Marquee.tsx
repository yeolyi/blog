import { cn } from '@/lib/utils';

export default function Marquee({
	children,
	reverse,
}: {
	children: React.ReactNode;
	reverse?: boolean;
}) {
	return (
		<div
			className='relative flex overflow-hidden text-6xl font-extrabold'
			id='cs'
		>
			<div
				className={cn('whitespace-pre', {
					'animate-marquee': !reverse,
					'animate-marquee-reverse': reverse,
				})}
			>
				<span>{children}</span>
				<span>{children}</span>
			</div>

			<div
				className={cn('absolute top-0 whitespace-pre', {
					'animate-marquee2': !reverse,
					'animate-marquee-reverse2': reverse,
				})}
			>
				<span>{children}</span>
				<span>{children}</span>
			</div>
		</div>
	);
}

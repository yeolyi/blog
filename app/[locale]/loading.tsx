import { Skeleton } from '@/components/ui/skeleton';

export default async function Loading() {
	return (
		// TODO: scrollbar shifting 막기 위한 lazy fix
		<div className='w-full mx-auto px-4 h-[120vh]'>
			<div className='flex flex-col gap-3 w-full max-w-2xl mx-auto'>
				<Skeleton className='w-full h7' />
				<Skeleton className='w-full h-7' />
				<Skeleton className='w-full h-7' />
				<Skeleton className='w-1/2 h-7' />
			</div>
		</div>
	);
}

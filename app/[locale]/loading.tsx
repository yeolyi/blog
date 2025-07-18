import { LoaderCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default async function Loading() {
	return (
		// TODO: scrollbar shifting 막기 위한 lazy fix
		<div className='w-full mx-auto px-4 h-[120vh]'>
			<LoaderCircle className='animate-spin mx-auto' />
		</div>
	);
}

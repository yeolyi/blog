import { LoaderCircle } from 'lucide-react';

export default async function Loading() {
	return (
		// TODO: scrollbar shifting 막기 위한 lazy fix
		<div className='w-full mx-auto px-6 h-[120vh]'>
			<LoaderCircle className='animate-spin mx-auto' />
		</div>
	);
}

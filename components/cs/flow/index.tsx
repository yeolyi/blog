import { Loader2 } from 'lucide-react';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import type { FlowProps } from '@/components/cs/flow/FlowImpl';

const FlowImpl = dynamic(() => import('./FlowImpl'));

export default function Flow(props: FlowProps) {
	return (
		<Suspense
			fallback={
				<div
					style={{ height: props.height }}
					className='w-full flex justify-center items-center'
				>
					<Loader2 className='animate-spin' />
				</div>
			}
		>
			<FlowImpl {...props} />
		</Suspense>
	);
}

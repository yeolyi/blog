'use client';

import dynamic from 'next/dynamic';
import Flow from '@/components/cs/flow';

const FlowPlayground = () => {
	return (
		<div className='flex flex-col justify-center p-2'>
			<Flow id='flow-playground' height={screen.height - 400} />
		</div>
	);
};

export default dynamic(() => Promise.resolve(FlowPlayground), {
	ssr: false,
});

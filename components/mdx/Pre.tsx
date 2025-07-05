'use client';

import clsx from 'clsx';
import { debounce } from 'es-toolkit';
import { CheckIcon, Clipboard } from 'lucide-react';
import { useCallback, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';

export default function Pre({
	children,
	...props
}: React.ComponentProps<'pre'>) {
	const ref = useRef<HTMLPreElement>(null);
	const [isCopied, setIsCopied] = useState(false);
	const reset = useCallback(
		debounce(() => setIsCopied(false), 1000),
		[],
	);

	return (
		<div className='relative'>
			<pre
				{...props}
				ref={ref}
				className={clsx(props.className, 'p-4 overflow-x-auto')}
			>
				{children}
			</pre>
			<Button
				variant='ghost'
				size='icon'
				className='absolute top-0 right-0'
				onClick={() => {
					navigator.clipboard.writeText(ref.current?.textContent ?? '');
					setIsCopied(true);
					reset();
				}}
			>
				{isCopied ? <CheckIcon /> : <Clipboard />}
			</Button>
		</div>
	);
}

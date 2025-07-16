'use client';

import {
	useCallback,
	useEffect,
	useLayoutEffect,
	useRef,
	useState,
} from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
const FancyInput = ({ ref }: { ref: any }) => {
	useEffect(() => {
		console.log('useEffect');
	}, []);

	useLayoutEffect(() => {
		console.log('useLayoutEffect');
	}, []);

	const inputRef = useRef<HTMLInputElement>(null);
	ref.current = {
		focus: () => {
			inputRef.current?.focus();
		},
	};

	// useEffect(() => {
	// 	ref.current = () => ({
	// 		focus: () => {
	// 			inputRef.current?.focus();
	// 		},
	// 	});
	// 	return () => {
	// 		ref.current = null;
	// 	};
	// }, [ref]);

	return <Input ref={inputRef} placeholder='예시 input' />;
};

export const UnmountExample = () => {
	const [isMounted, setIsMounted] = useState(true);
	const ref = useRef<HTMLInputElement>(null);

	useEffect(() => {
		toast.info(`ref.current: ${ref.current}`);
	});

	return (
		<div className='flex flex-col gap-4 w-sm'>
			<Button onClick={() => setIsMounted((x) => !x)} type='button'>
				{isMounted ? 'unmount' : 'mount'}
			</Button>
			{isMounted && <Input ref={ref} placeholder='예시 input' />}
		</div>
	);
};

export const RefDuringRender = () => {
	const [isMounted, setIsMounted] = useState(true);
	const ref = useRef<HTMLInputElement>(null);

	return (
		<div className='flex flex-col gap-4 w-sm'>
			<Button onClick={() => setIsMounted((x) => !x)} type='button'>
				{isMounted ? 'unmount' : 'mount'}
			</Button>
			{isMounted && <Input ref={ref} placeholder='예시 input' />}
			<p>ref.current: {ref.current?.toString() ?? 'null'}</p>
		</div>
	);
};

export const FancyInputTest = () => {
	const ref = useRef<HTMLInputElement>(null);
	const focus = useCallback(() => {
		ref.current?.focus();
	}, []);

	return (
		<div className='flex gap-2 w-sm'>
			<FancyInput ref={ref} />
			<Button onClick={focus} type='button'>
				focus
			</Button>
		</div>
	);
};

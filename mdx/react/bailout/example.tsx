'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

const Container = ({ children }: { children: React.ReactNode }) => {
	return <div className='border border-border p-4'>{children}</div>;
};

const A = () => {
	toast.info('A');
	return (
		<Container>
			A
			<B />
			<E />
		</Container>
	);
};

const B = () => {
	toast.info('B');
	return (
		<Container>
			B<C />
		</Container>
	);
};

const C = () => {
	const [count, setCount] = useState(0);
	toast.info('C');
	return (
		<Container>
			C<br />
			<Button onClick={() => setCount((x) => x + 1)}>{count}</Button>
			<D />
		</Container>
	);
};

const D = () => {
	toast.info('D');
	return <Container>D</Container>;
};

const E = () => {
	toast.info('E');
	return (
		<Container>
			<F />
		</Container>
	);
};

const F = () => {
	toast.info('F');
	return <Container>F</Container>;
};

export const Example = () => {
	return <A />;
};

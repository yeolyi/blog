'use client';

import { spring } from 'motion';
import { useAnimate } from 'motion/react-mini';
import { cloneElement, isValidElement, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface MdxProps extends React.HTMLAttributes<HTMLDivElement> {
	children: React.ReactNode;
	asChild?: boolean;
	className?: string;
}

export default function AppearAnimation({
	children,
	className = '',
	asChild = false,
	...rest
}: MdxProps) {
	const [scope, animate] = useAnimate();

	useEffect(() => {
		animate(
			scope.current,
			{
				opacity: 1,
				transform: 'translateY(0px)',
			},
			{ duration: 1.25, type: spring },
		);
	}, [animate, scope]);

	if (asChild && isValidElement(children)) {
		return cloneElement(children, {
			// @ts-expect-error 어쩌지
			ref: scope,
			// biome-ignore lint/suspicious/noExplicitAny: 어쩔까
			className: cn((children as any).props.className, className),
			style: {
				opacity: 0.01,
				transform: 'translateY(5px)',
				willChange: 'opacity, transform',
			},
			...rest,
		});
	}

	return (
		<div
			ref={scope}
			style={{
				opacity: 0.01,
				transform: 'translateY(5px)',
				willChange: 'opacity, transform',
			}}
			{...rest}
		>
			{children}
		</div>
	);
}

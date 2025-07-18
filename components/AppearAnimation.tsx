'use client';

import gsap from 'gsap';
import { cloneElement, isValidElement, useEffect, useRef } from 'react';
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
	const el = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (el.current) {
			gsap.fromTo(
				el.current,
				{ opacity: 0.01 },
				{ opacity: 1, duration: 0.75, ease: 'power2.out' },
			);
			gsap.fromTo(
				el.current,
				{ transform: 'translateY(5px)' },
				{ transform: 'translateY(0px)', duration: 0.75 },
			);
		}
	}, []);

	if (asChild && isValidElement(children)) {
		return cloneElement(children, {
			// @ts-expect-error 어쩌지
			ref: el,
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
			ref={el}
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

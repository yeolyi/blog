'use client';

import clsx from 'clsx';
import { ChevronsUpDown } from 'lucide-react';
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from '@/components/ui/collapsible';

export type CollapsibleSectionProps = {
	/** Trigger text (or any React node) displayed before the chevron icon */
	trigger: React.ReactNode;
	/** Content to render inside the collapsible section */
	children: React.ReactNode;
	/** Optional additional class names for the root Collapsible */
	className?: string;
	/** Optional additional class names for the trigger element */
	triggerClassName?: string;
	/** Optional additional class names for the content element */
	contentClassName?: string;
};

/**
 * A thin wrapper around Radix UI Collapsible that provides a common layout
 * (text + chevron) for the trigger. Pass any React nodes as children to render
 * inside the collapsible content.
 */
export default function CollapsibleSection({
	trigger,
	children,
	className,
	triggerClassName,
	contentClassName,
}: CollapsibleSectionProps) {
	return (
		<Collapsible className={className}>
			<CollapsibleTrigger className={clsx('flex items-center', triggerClassName)}>
				<p className='font-extrabold flex items-center'>
					{trigger}
					<ChevronsUpDown className='w-4 h-4 inline ml-2' />
				</p>
			</CollapsibleTrigger>
			<CollapsibleContent className={clsx('mt-7', contentClassName)}>
				{children}
			</CollapsibleContent>
		</Collapsible>
	);
}

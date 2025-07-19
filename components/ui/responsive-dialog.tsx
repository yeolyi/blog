'use client';

import * as React from 'react';
import { useMediaQuery } from '@/components/hooks/useMediaQuery';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import {
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from '@/components/ui/drawer';
import { cn } from '@/lib/utils';

type ResponsiveDialogContextValue = {
	isDesktop: boolean;
};

const ResponsiveDialogContext =
	React.createContext<ResponsiveDialogContextValue | null>(null);

const useResponsiveDialogContext = () => {
	const context = React.useContext(ResponsiveDialogContext);
	if (!context) {
		throw new Error(
			'useResponsiveDialogContext must be used within a ResponsiveDialog',
		);
	}
	return context;
};

type ResponsiveDialogProps = React.ComponentProps<typeof Dialog> & {
	children: React.ReactNode;
};

function ResponsiveDialog({ children, ...props }: ResponsiveDialogProps) {
	const isDesktop = useMediaQuery('(min-width: 640px)');
	const contextValue = React.useMemo(() => ({ isDesktop }), [isDesktop]);
	const Component = isDesktop ? Dialog : Drawer;

	return (
		<ResponsiveDialogContext.Provider value={contextValue}>
			<Component {...props}>{children}</Component>
		</ResponsiveDialogContext.Provider>
	);
}

const ResponsiveDialogTrigger = React.forwardRef<
	React.ElementRef<typeof DialogTrigger>,
	React.ComponentPropsWithoutRef<typeof DialogTrigger>
>(({ children, ...props }, ref) => {
	const { isDesktop } = useResponsiveDialogContext();
	const Component = isDesktop ? DialogTrigger : DrawerTrigger;

	return (
		<Component ref={ref} {...props}>
			{children}
		</Component>
	);
});
ResponsiveDialogTrigger.displayName = 'ResponsiveDialogTrigger';

const ResponsiveDialogContent = React.forwardRef<
	React.ElementRef<typeof DialogContent>,
	React.ComponentPropsWithoutRef<typeof DialogContent>
>(({ children, ...props }, ref) => {
	const { isDesktop } = useResponsiveDialogContext();
	const Component = isDesktop ? DialogContent : DrawerContent;

	return (
		<Component ref={ref} {...props}>
			{children}
		</Component>
	);
});
ResponsiveDialogContent.displayName = 'ResponsiveDialogContent';

function ResponsiveDialogHeader({
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement>) {
	const { isDesktop } = useResponsiveDialogContext();
	const Component = isDesktop ? DialogHeader : DrawerHeader;
	return (
		<Component
			className={cn(!isDesktop ? 'text-left' : '', className)}
			{...props}
		/>
	);
}
ResponsiveDialogHeader.displayName = 'ResponsiveDialogHeader';

const ResponsiveDialogFooter = ({
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement>) => {
	const { isDesktop } = useResponsiveDialogContext();
	const Component = isDesktop ? DialogFooter : DrawerFooter;
	return <Component className={className} {...props} />;
};
ResponsiveDialogFooter.displayName = 'ResponsiveDialogFooter';

const ResponsiveDialogTitle = React.forwardRef<
	React.ElementRef<typeof DialogTitle>,
	React.ComponentPropsWithoutRef<typeof DialogTitle>
>(({ className, ...props }, ref) => {
	const { isDesktop } = useResponsiveDialogContext();
	const Component = isDesktop ? DialogTitle : DrawerTitle;

	return <Component ref={ref} className={className} {...props} />;
});
ResponsiveDialogTitle.displayName = 'ResponsiveDialogTitle';

const ResponsiveDialogDescription = React.forwardRef<
	React.ElementRef<typeof DialogDescription>,
	React.ComponentPropsWithoutRef<typeof DialogDescription>
>(({ className, ...props }, ref) => {
	const { isDesktop } = useResponsiveDialogContext();
	const Component = isDesktop ? DialogDescription : DrawerDescription;

	return <Component ref={ref} className={className} {...props} />;
});
ResponsiveDialogDescription.displayName = 'ResponsiveDialogDescription';

export {
	ResponsiveDialog,
	ResponsiveDialogTrigger,
	ResponsiveDialogContent,
	ResponsiveDialogHeader,
	ResponsiveDialogFooter,
	ResponsiveDialogTitle,
	ResponsiveDialogDescription,
};

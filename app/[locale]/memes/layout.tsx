import { type ReactNode, Suspense } from 'react';

export default function MemesLayout({ children }: { children: ReactNode }) {
	return <Suspense>{children}</Suspense>;
}

import type { Metadata } from 'next';

export const metadata: Metadata = {
	title: '리액트 소스코드 공부',
};

export default function ReactLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return children;
}

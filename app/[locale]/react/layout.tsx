import type { Metadata } from 'next';

export const metadata: Metadata = {
	title: '리액트 소스코드 스터디',
	description: '사내 스터디에서 리액트를 직접 뜯어본 내용을 기록합니다.',
};

export default function ReactLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return children;
}

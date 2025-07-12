import type { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'NAND is more than just NAND',
	description:
		'학교에서 컴퓨터 공학을 배우며 느낀 경이로움을 기록하고 전달합니다.',
};

export default function CSLayout({ children }: { children: React.ReactNode }) {
	return children;
}

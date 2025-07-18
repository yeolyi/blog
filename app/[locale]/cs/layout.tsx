import type { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'NAND is more than just NAND',
	description: '0과 1에서 시작해 함께 컴퓨터를 만들어봅시다.',
};

export default function CSLayout({ children }: { children: React.ReactNode }) {
	return children;
}

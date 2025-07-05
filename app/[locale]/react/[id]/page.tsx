import { notFound } from 'next/navigation';
import Comments from '@/components/comment';
import PostNavigation from '@/components/layout/PostNavigation';
import { order } from '@/mdx/react';
import { getMdxIds } from '@/utils/path';

export const dynamic = 'force-dynamic';

export default async function PostPage({
	params,
}: {
	params: Promise<{ id: string; locale: string }>;
}) {
	const { id } = await params;

	try {
		const { default: Component, title } = await import(
			`@/mdx/react/${id}/ko.mdx`
		);

		return (
			<div className='px-4 mdx'>
				<h1>{title}</h1>
				<Component />
				<PostNavigation id={id} subDir='react' className='mb-12' order={order} />
				<Comments
					// 기존에 post에 올린거 호환 목적
					// TODO: DB에서 옮기고 없애기
					postId={id === 'setup' ? 'react-local-build' : `react/${id}`}
				/>
			</div>
		);
	} catch {
		notFound();
	}
}

export const generateStaticParams = async () => {
	const result = [];

	const postIds = await getMdxIds('ko', 'react');
	for (const postId of postIds) {
		result.push({ id: postId, locale: 'ko' });
	}

	return result;
};

export const dynamicParams = false;

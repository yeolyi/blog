import type { Metadata, ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';
import AppearAnimation from '@/components/AppearAnimation';
import Comments from '@/components/comment';
import PostNavigation from '@/components/layout/PostNavigation';
import { Separator } from '@/components/ui/separator';
import { order } from '@/mdx/react';
import { getMdxIds } from '@/utils/path';

export async function generateMetadata(
	{
		params,
	}: {
		params: Promise<{ id: string; locale: string }>;
	},
	parent: ResolvingMetadata,
): Promise<Metadata> {
	const { id, locale } = await params;
	const { title, description } = await import(`@/mdx/react/${id}/${locale}.mdx`);

	const parentMetadata = await parent;
	const parentTitle = parentMetadata.title;
	const parentDescription = parentMetadata.description;
	const images = parentMetadata.openGraph?.images || [];

	return {
		title: title ?? parentTitle,
		description: description ?? parentDescription,
		openGraph: { title, description, images },
	};
}

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
			<AppearAnimation asChild>
				<div className='mdx'>
					<h1>{title}</h1>
					<Separator />
					<Component />
					<PostNavigation
						id={id}
						subDir='react'
						className='mb-12'
						order={order}
						listHref='/react'
					/>
					<Comments
						// 기존에 post에 올린거 호환 목적
						// TODO: DB에서 옮기고 없애기
						postId={id === 'setup' ? 'react-local-build' : `react/${id}`}
					/>
				</div>
			</AppearAnimation>
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

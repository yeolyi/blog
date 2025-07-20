import type { Metadata, ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';
import AppearAnimation from '@/components/AppearAnimation';
import Comments from '@/components/comment';
import PostNavigation from '@/components/layout/PostNavigation';
import { Separator } from '@/components/ui/separator';
import { routing } from '@/i18n/routing';
import { csOrder } from '@/mdx/cs';
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
	const { title, description } = await import(`@/mdx/cs/${id}/${locale}.mdx`);

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
	const { id, locale } = await params;

	try {
		const { default: Component, title } = await import(
			`@/mdx/cs/${id}/${locale}.mdx`
		);

		return (
			<AppearAnimation asChild>
				<div className='mdx'>
					<h1>{title}</h1>
					<Separator />
					<Component />
					<PostNavigation id={id} subDir='cs' order={csOrder} listHref='/cs' />
					<Comments postId={id} />
				</div>
			</AppearAnimation>
		);
	} catch {
		notFound();
	}
}

export const generateStaticParams = async () => {
	const locales = routing.locales;
	const result = [];

	for (const locale of locales) {
		const postIds = await getMdxIds(locale, 'cs');
		for (const postId of postIds) {
			result.push({ id: postId, locale });
		}
	}

	return result;
};

export const dynamicParams = false;

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Comments from '@/components/comment';
import { routing } from '@/i18n/routing';
import { getPostIds } from '@/utils/path';

export const dynamic = 'force-dynamic';

type Props = {
	params: Promise<{ id: string; locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { id, locale } = await params;
	const { title, description } = await import(`@/mdx/${id}/${locale}.mdx`);
	return { title, description };
}

export default async function PostPage({
	params,
}: {
	params: Promise<{ id: string; locale: string }>;
}) {
	const { id, locale } = await params;

	try {
		const { default: Component, title } = await import(
			`@/mdx/${id}/${locale}.mdx`
		);

		return (
			<div className='mdx px-4'>
				<h1>{title}</h1>
				<Component />
				<Comments postId={id} className='mt-21' />
			</div>
		);
	} catch {
		notFound();
	}
}

export const generateStaticParams = async () => {
	const locales = routing.locales;
	const result = [];

	for (const locale of locales) {
		const postIds = await getPostIds(locale);
		for (const postId of postIds) {
			result.push({ id: postId, locale });
		}
	}

	return result;
};

export const dynamicParams = false;

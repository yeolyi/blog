import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import AppearAnimation from '@/components/AppearAnimation';
import Comments from '@/components/comment';
import { routing } from '@/i18n/routing';
import { getMdxIds } from '@/utils/path';

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
			<AppearAnimation asChild>
				<div className='mdx px-4'>
					<h1>{title}</h1>
					<Component />
					<Comments postId={id} className='mt-21' />
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
		const postIds = await getMdxIds(locale);
		for (const postId of postIds) {
			result.push({ id: postId, locale });
		}
	}

	return result;
};

export const dynamicParams = false;

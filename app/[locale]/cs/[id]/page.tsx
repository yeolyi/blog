import { notFound } from 'next/navigation';
import { generateCSMetadata } from '@/app/[locale]/cs/utils/generateCSMetadata';
import Comments from '@/components/comment';
import PostNavigation from '@/components/layout/PostNavigation';
import { routing } from '@/i18n/routing';
import { order } from '@/mdx/cs';
import { getPostIds } from '@/utils/path';

export const dynamic = 'force-dynamic';
export const generateMetadata = generateCSMetadata;

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
			<div className='px-4 mdx'>
				<h1>{title}</h1>
				<Component />
				<PostNavigation id={id} subDir='cs' order={order} listHref='/' />
				<Comments postId={id} />
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
		const postIds = await getPostIds(locale, 'cs');
		for (const postId of postIds) {
			result.push({ id: postId, locale });
		}
	}

	return result;
};

export const dynamicParams = false;

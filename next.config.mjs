import bundleAnalyzer from '@next/bundle-analyzer';
import createMDX from '@next/mdx';
import rehypeShiki from '@shikijs/rehype';
import {
	transformerNotationDiff,
	transformerNotationFocus,
	transformerNotationHighlight,
} from '@shikijs/transformers';
import createNextIntlPlugin from 'next-intl/plugin';
import rehypeKatex from 'rehype-katex';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';

const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'http',
				hostname: 'localhost',
			},
			{
				protocol: 'https',
				hostname: 'yeolyi.com',
			},
			{
				protocol: 'https',
				hostname: 'jfzhtdcyaqwgugipnmhs.supabase.co',
			},
		],
	},
	pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
	transpilePackages: ['shiki', '@shikijs/rehype'],
	eslint: { ignoreDuringBuilds: true },
	experimental: {
		serverActions: { bodySizeLimit: '2mb' },
	},
};

const withMDX = createMDX({
	options: {
		remarkPlugins: [remarkGfm, remarkMath],
		rehypePlugins: [
			rehypeSlug,
			[rehypeKatex, { strict: false }],
			[
				rehypeShiki,
				{
					inline: 'tailing-curly-colon',
					themes: {
						light: 'one-light',
						dark: 'one-dark-pro',
					},
					defaultColor: 'light-dark()',
					transformers: [
						transformerNotationHighlight(),
						transformerNotationFocus(),
						transformerNotationDiff(),
					],
				},
			],
		],
	},
});

const withNextIntl = createNextIntlPlugin();
const withBundleAnalyzer = bundleAnalyzer({
	enabled: process.env.ANALYZE === 'true',
});

export default withMDX(withNextIntl(withBundleAnalyzer(nextConfig)));

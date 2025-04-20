import createMDX from '@next/mdx';
import rehypeShiki from '@shikijs/rehype';
import {
  transformerNotationFocus,
  transformerNotationHighlight,
} from '@shikijs/transformers';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';

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
  eslint: {
    ignoreDuringBuilds: true,
  },
};

const withMDX = createMDX({
  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
      [
        rehypeShiki,
        {
          theme: 'github-dark',
          transformers: [
            transformerNotationHighlight(),
            transformerNotationFocus(),
          ],
        },
      ],
    ],
  },
});

export default withMDX(nextConfig);

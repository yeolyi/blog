import createMDX from '@next/mdx';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure `pageExtensions` to include MDX files
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  redirects() {
    return [
      {
        source: '/js',
        destination: '/js/0',
        permanent: true,
      },
      ...[...Array(4).keys()].map((i) => ({
        source: `/js/${i}`,
        destination: '/',
        permanent: true,
      })),
    ];
  },
};

const withMDX = createMDX({
  options: { remarkPlugins: [remarkGfm], rehypePlugins: [rehypeSlug] },
});

export default withMDX(nextConfig);

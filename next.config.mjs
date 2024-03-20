import remarkGfm from 'remark-gfm';
import createMDX from '@next/mdx';

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure `pageExtensions` to include MDX files
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],

  output: 'standalone',
};

const withMDX = createMDX({
  options: { remarkPlugins: [remarkGfm], rehypePlugins: [] },
});

export default withMDX(nextConfig);

import mdx from '@mdx-js/rollup';
import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'path';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    manifest: true,
    rollupOptions: {
      // overwrite default .html entry
      input: './client/entry-client.tsx',
    },
  },
  plugins: [
    {
      enforce: 'pre',
      ...mdx({ remarkPlugins: [remarkGfm], rehypePlugins: [rehypeSlug] }),
    },
    react(),
    tsconfigPaths(),
  ],
  resolve: {
    alias: [{ find: '@', replacement: __dirname }],
  },
});

import mdx from '@mdx-js/rollup';
import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import rehypeSlug from 'rehype-slug';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';
import remarkGfm from 'remark-gfm';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    manifest: true,
    rollupOptions: {
      // overwrite default .html entry
      input: './client/entry-client.tsx',
    },
    target: 'esnext',
    // 카톡에서 inline svg를 보여주지 않는 것 같아 비활성화
    assetsInlineLimit: 0,
  },
  plugins: [
    {
      enforce: 'pre',
      ...mdx({ remarkPlugins: [remarkGfm], rehypePlugins: [rehypeSlug] }),
    },
    react(),
    tsconfigPaths(),
    ViteImageOptimizer({}),
  ],
  resolve: {
    alias: [{ find: '@', replacement: __dirname }],
  },
});

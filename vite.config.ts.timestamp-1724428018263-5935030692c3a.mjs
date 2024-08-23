// vite.config.ts
import mdx from "file:///Users/leo.yi/Developer/blog/node_modules/.pnpm/@mdx-js+rollup@3.0.1_rollup@4.20.0/node_modules/@mdx-js/rollup/index.js";
import react from "file:///Users/leo.yi/Developer/blog/node_modules/.pnpm/@vitejs+plugin-react-swc@3.7.0_vite@5.4.0_@types+node@22.2.0_/node_modules/@vitejs/plugin-react-swc/index.mjs";
import { defineConfig } from "file:///Users/leo.yi/Developer/blog/node_modules/.pnpm/vite@5.4.0_@types+node@22.2.0/node_modules/vite/dist/node/index.js";
import tsconfigPaths from "file:///Users/leo.yi/Developer/blog/node_modules/.pnpm/vite-tsconfig-paths@5.0.1_typescript@5.5.4_vite@5.4.0_@types+node@22.2.0_/node_modules/vite-tsconfig-paths/dist/index.js";
import path from "path";
import rehypeSlug from "file:///Users/leo.yi/Developer/blog/node_modules/.pnpm/rehype-slug@6.0.0/node_modules/rehype-slug/index.js";
import remarkGfm from "file:///Users/leo.yi/Developer/blog/node_modules/.pnpm/remark-gfm@4.0.0/node_modules/remark-gfm/index.js";
var __vite_injected_original_dirname = "/Users/leo.yi/Developer/blog";
var vite_config_default = defineConfig({
  build: {
    manifest: true,
    rollupOptions: {
      // overwrite default .html entry
      input: "./src/entry-client.tsx"
    }
  },
  plugins: [
    {
      enforce: "pre",
      ...mdx({ remarkPlugins: [remarkGfm], rehypePlugins: [rehypeSlug] })
    },
    react(),
    tsconfigPaths()
  ],
  resolve: {
    alias: [{ find: "@", replacement: path.resolve(__vite_injected_original_dirname, "src") }]
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvbGVvLnlpL0RldmVsb3Blci9ibG9nXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvbGVvLnlpL0RldmVsb3Blci9ibG9nL3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9sZW8ueWkvRGV2ZWxvcGVyL2Jsb2cvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgbWR4IGZyb20gJ0BtZHgtanMvcm9sbHVwJztcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdC1zd2MnO1xuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSc7XG5pbXBvcnQgdHNjb25maWdQYXRocyBmcm9tICd2aXRlLXRzY29uZmlnLXBhdGhzJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHJlaHlwZVNsdWcgZnJvbSAncmVoeXBlLXNsdWcnO1xuaW1wb3J0IHJlbWFya0dmbSBmcm9tICdyZW1hcmstZ2ZtJztcblxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIGJ1aWxkOiB7XG4gICAgbWFuaWZlc3Q6IHRydWUsXG4gICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgLy8gb3ZlcndyaXRlIGRlZmF1bHQgLmh0bWwgZW50cnlcbiAgICAgIGlucHV0OiAnLi9zcmMvZW50cnktY2xpZW50LnRzeCcsXG4gICAgfSxcbiAgfSxcbiAgcGx1Z2luczogW1xuICAgIHtcbiAgICAgIGVuZm9yY2U6ICdwcmUnLFxuICAgICAgLi4ubWR4KHsgcmVtYXJrUGx1Z2luczogW3JlbWFya0dmbV0sIHJlaHlwZVBsdWdpbnM6IFtyZWh5cGVTbHVnXSB9KSxcbiAgICB9LFxuICAgIHJlYWN0KCksXG4gICAgdHNjb25maWdQYXRocygpLFxuICBdLFxuICByZXNvbHZlOiB7XG4gICAgYWxpYXM6IFt7IGZpbmQ6ICdAJywgcmVwbGFjZW1lbnQ6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICdzcmMnKSB9XSxcbiAgfSxcbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFzUSxPQUFPLFNBQVM7QUFDdFIsT0FBTyxXQUFXO0FBQ2xCLFNBQVMsb0JBQW9CO0FBQzdCLE9BQU8sbUJBQW1CO0FBQzFCLE9BQU8sVUFBVTtBQUNqQixPQUFPLGdCQUFnQjtBQUN2QixPQUFPLGVBQWU7QUFOdEIsSUFBTSxtQ0FBbUM7QUFTekMsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsT0FBTztBQUFBLElBQ0wsVUFBVTtBQUFBLElBQ1YsZUFBZTtBQUFBO0FBQUEsTUFFYixPQUFPO0FBQUEsSUFDVDtBQUFBLEVBQ0Y7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQO0FBQUEsTUFDRSxTQUFTO0FBQUEsTUFDVCxHQUFHLElBQUksRUFBRSxlQUFlLENBQUMsU0FBUyxHQUFHLGVBQWUsQ0FBQyxVQUFVLEVBQUUsQ0FBQztBQUFBLElBQ3BFO0FBQUEsSUFDQSxNQUFNO0FBQUEsSUFDTixjQUFjO0FBQUEsRUFDaEI7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLE9BQU8sQ0FBQyxFQUFFLE1BQU0sS0FBSyxhQUFhLEtBQUssUUFBUSxrQ0FBVyxLQUFLLEVBQUUsQ0FBQztBQUFBLEVBQ3BFO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K

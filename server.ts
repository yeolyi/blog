import express from 'express';
import { config } from 'dotenv';
import { stargazerCache } from './server/stargazer.js';
import { instagramCache } from './server/instagram.js';
import { ViteDevServer } from 'vite';

// Constants
const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const PORT = 5173;
const BASE = '/';

// Create http server
const app = express();

// Add Vite or respective production middlewares
let vite: ViteDevServer;
if (IS_PRODUCTION) {
  const compression = (await import('compression')).default;
  const sirv = (await import('sirv')).default;

  app.use(compression());
  app.use(BASE, sirv('./dist/client', { extensions: [] }));
} else {
  const { createServer } = await import('vite');
  vite = await createServer({
    server: { middlewareMode: true },
    appType: 'custom',
    base: BASE,
  });
  app.use(vite.middlewares);
}

// API
config();

app.get('/stargazer', async (_req, res) => {
  res.status(200);
  res.set({ 'Content-Type': 'text/html' });
  res.send(String(await stargazerCache.get()));
});

app.get('/instagram-follower', async (_req, res) => {
  res.status(200);
  res.set({ 'Content-Type': 'text/html' });
  res.send(String(await instagramCache.get()));
});

// SSR
app.use('*', async (req, res) => {
  try {
    const url = '/' + req.originalUrl.replace(BASE, '');

    const render = (
      IS_PRODUCTION ?
        // @ts-expect-error
        await import('./dist/server/entry-server.js')
      : await vite.ssrLoadModule('/client/entry-server.tsx')).render;

    render(url, res);
  } catch (e) {
    if (e instanceof Error) {
      vite?.ssrFixStacktrace(e);
      console.log(e.stack);
      res.status(500).end(e.stack);
    } else {
      throw e;
    }
  }
});

// Start http server
app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});

import 'dotenv/config';

import express from 'express';
import { prepareServerWithModule } from '@/server';
import { Express } from 'express';

export const BASE = '/';
export const IS_PRODUCTION = process.env.NODE_ENV === 'production';
export const PORT = 5173;

const setupProduction = async (app: Express) => {
  const compression = (await import('compression')).default;
  const sirv = (await import('sirv')).default;

  app.use(compression());
  app.use(BASE, sirv('./dist/client', { extensions: [] }));

  // @ts-expect-error
  const module = await import('./dist/server/entry-server.js');
  prepareServerWithModule(app, module);
};

const setupDev = async (app: Express) => {
  const { createServer } = await import('vite');
  let vite = await createServer({
    server: { middlewareMode: true },
    appType: 'custom',
    base: BASE,
  });
  app.use(vite.middlewares);

  const module = await vite.ssrLoadModule('/client/entry-server.tsx');
  const onError = (e: Error) => vite.ssrFixStacktrace(e);
  // @ts-expect-error
  prepareServerWithModule(app, module, onError);
};

const app = express();

if (IS_PRODUCTION) {
  await setupProduction(app);
} else {
  await setupDev(app);
}

app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});

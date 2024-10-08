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

  // @ts-expect-error dist 폴더가 없을 수 있음
  const module = await import('./dist/server/entry-server.js');
  prepareServerWithModule(app, module);
};

const setupDev = async (app: Express) => {
  const { createServer } = await import('vite');
  const vite = await createServer({
    server: { middlewareMode: true },
    appType: 'custom',
    base: BASE,
  });
  app.use(vite.middlewares);

  // SSR
  app.use('*', async (req, res) => {
    try {
      const module = await vite.ssrLoadModule('/client/entry-server.tsx');
      module.render(req.baseUrl, res);
    } catch (e) {
      if (e instanceof Error) {
        vite.ssrFixStacktrace(e);
        console.log(e.stack);
        res.sendStatus(500);
      } else {
        throw e;
      }
    }
  });
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

import express from 'express';
import { config } from 'dotenv';
import { BASE, IS_PRODUCTION, PORT } from '@/constants/server.js';
import { prepareServerWithModule } from '@/server/prepareServerWithModule.js';
import { Express } from 'express';

config();

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
  setupProduction(app);
} else {
  setupDev(app);
}

app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});

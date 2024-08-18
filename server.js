import express from 'express';

// Constants
const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const PORT = 5173;
const BASE = '/';

// Create http server
const app = express();

// Add Vite or respective production middlewares
let vite;
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

// Serve HTML
app.use('*', async (req, res) => {
  try {
    const url = '/' + req.originalUrl.replace(BASE, '');

    const render = (
      IS_PRODUCTION ?
        await import('./dist/server/entry-server.js')
      : await vite.ssrLoadModule('/src/entry-server.tsx')).render;

    render(url, res);
  } catch (e) {
    vite?.ssrFixStacktrace(e);
    console.log(e.stack);
    res.status(500).end(e.stack);
  }
});

// Start http server
app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});

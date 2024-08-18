import React from 'react';
import { StaticRouter } from 'react-router-dom/server';
import { App } from '@/App';
import { renderToPipeableStream } from 'react-dom/server';
import { Response } from 'express';
import manifest from '../dist/client/.vite/manifest.json';

const ABORT_DELAY = 10000;
let bootstrapModuleUrl = '/' + manifest['src/entry-client.tsx'].file;

const cssPath =
  import.meta.env.DEV ?
    '/src/index.css'
  : '/' + manifest['src/entry-client.tsx'].css[0];

export const render = (url: string, res: Response) => {
  const { pipe, abort } = renderToPipeableStream(
    <React.StrictMode>
      <StaticRouter location={url}>
        <App cssPath={cssPath} />
      </StaticRouter>
    </React.StrictMode>,
    {
      bootstrapScriptContent: `window.cssPath = '${cssPath}'`,
      bootstrapModules: import.meta.env.DEV ? undefined : [bootstrapModuleUrl],

      onShellError() {
        res.status(500);
        res.set({ 'Content-Type': 'text/html' });
        res.send('<h1>Something went wrong</h1>');
      },

      onShellReady() {
        res.status(200);
        res.set({ 'Content-Type': 'text/html' });
        pipe(res);
      },
    },
  );

  setTimeout(() => {
    abort();
  }, ABORT_DELAY);
};

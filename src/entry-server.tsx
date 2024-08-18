import React from 'react';
import { StaticRouter } from 'react-router-dom/server';
import { App } from '@/App';
import {
  renderToPipeableStream,
  RenderToPipeableStreamOptions,
} from 'react-dom/server';
import { Response } from 'express';
import manifest from '../dist/client/.vite/manifest.json';

const ABORT_DELAY = 10000;

export const render = (url: string, res: Response) => {
  let didError = false;

  const { pipe, abort } = _render(url, undefined, {
    bootstrapModules:
      import.meta.env.DEV ?
        [
          'http://localhost:5173/@vite/client',
          'http://localhost:5173/src/entry-client.tsx',
        ]
      : ['/' + manifest['src/entry-client.tsx'].file],
    onShellError() {
      res.status(500);
      res.set({ 'Content-Type': 'text/html' });
      res.send('<h1>Something went wrong</h1>');
    },
    onShellReady() {
      res.status(didError ? 500 : 200);
      res.set({ 'Content-Type': 'text/html' });
      pipe(res);
    },
    onError(error) {
      didError = true;
      console.error(error);
    },
  });

  setTimeout(() => {
    abort();
  }, ABORT_DELAY);
};

export const _render = (
  url: string,
  _ssrManifest?: string,
  options?: RenderToPipeableStreamOptions,
) => {
  return renderToPipeableStream(
    <React.StrictMode>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </React.StrictMode>,
    options,
  );
};

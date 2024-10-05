import React from 'react';
import { renderToPipeableStream } from 'react-dom/server';
import { Response } from 'express';
import manifest from '../dist/client/.vite/manifest.json';
import { HTML } from '@/client/HTML';
import { sitemap as _sitemap } from '@/client/constants/sitemap';
import { xml as _xml } from '@/client/constants/xml';
import { Router } from 'wouter';

export const sitemap = _sitemap;
export const xml = _xml;

const ABORT_DELAY = 10000;

const cssPath =
  import.meta.env.DEV ?
    '/client/index.css'
  : '/' + manifest['client/entry-client.tsx'].css[0];

export const render = (url: string, res: Response) => {
  const { pipe, abort } = renderToPipeableStream(
    <React.StrictMode>
      <Router ssrPath={url === '' ? '/' : url}>
        <HTML cssPath={cssPath} />
      </Router>
    </React.StrictMode>,
    {
      bootstrapScriptContent: `window.cssPath = '${cssPath}'`,
      bootstrapModules:
        import.meta.env.DEV ?
          undefined
        : ['/' + manifest['client/entry-client.tsx'].file],

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

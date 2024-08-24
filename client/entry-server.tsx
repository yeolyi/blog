import React from 'react';
import { StaticRouter } from 'react-router-dom/server';
import { App } from '@/client/App';
import { renderToPipeableStream, renderToString } from 'react-dom/server';
import { Response } from 'express';
import manifest from '../dist/client/.vite/manifest.json';
import { postPageList } from '@/client/mdx/post/page';
import RSS from 'rss';

const ABORT_DELAY = 10000;
let bootstrapModuleUrl = '/' + manifest['client/entry-client.tsx'].file;

const cssPath =
  import.meta.env.DEV ?
    '/client/index.css'
  : '/' + manifest['client/entry-client.tsx'].css[0];

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

let BASE_URL = 'https://yeolyi.com';

let feed = new RSS({
  title: '개발자 성열',
  description: '배우고 익히는 재미로 사는 프론트엔드 개발자 이성열입니다.',
  feed_url: `${BASE_URL}/rss.xml`,
  site_url: BASE_URL,
  image_url: `${BASE_URL}/favicon.ico`,
});

for (let page of postPageList) {
  const Mdx = (await page.mdx).default;

  feed.item({
    title: page.title,
    description: renderToString(<Mdx />),
    url: page.path,
    date: page.dateStr ?? '1970.01.01',
  });
}

export let xml = feed.xml();

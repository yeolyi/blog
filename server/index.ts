type Module = typeof import('../client/entry-server.js');

import { fetchFollowerCnt } from '@/server/instagram.js';
import { fetchStargazer } from '@/server/stargazer.js';
import { Express } from 'express';

export function prepareServerWithModule(
  app: Express,
  { render, sitemap, xml }: Module,
  onError?: (e: Error) => void,
) {
  app.get('/stargazer', async (_req, res) => {
    res.status(200);
    res.set({
      'Content-Type': 'text/html',
      'Cache-Control': 'public, max-age=60',
    });
    res.send(String(await fetchStargazer()));
  });

  app.get('/instagram-follower', async (_req, res) => {
    res.status(200);
    res.set({ 'Content-Type': 'text/html' });
    res.send(String(await fetchFollowerCnt()));
  });

  app.get('/rss.xml', async (_req, res) => {
    res.status(200);
    res.set({ 'Content-Type': 'text/xml' });
    res.send(xml);
  });

  app.get('/sitemap.xml', async (_req, res) => {
    res.status(200);
    res.set({ 'Content-Type': 'text/xml' });
    res.send(sitemap);
  });

  // SSR
  app.use('*', async (req, res) => {
    try {
      render(req.baseUrl, res);
    } catch (e) {
      if (e instanceof Error) {
        onError?.(e);
        console.log(e.stack);
        res.sendStatus(500);
      } else {
        throw e;
      }
    }
  });
}

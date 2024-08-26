type Module = typeof import('../client/entry-server.js');
import { BASE } from '@/constants/server.js';
import { instagramCache } from '@/server/instagram.js';
import { fetchCache } from '@/server/instagramComment.js';
import { stargazerCache } from '@/server/stargazer.js';
import { Express } from 'express';

export function prepareServerWithModule(
  app: Express,
  { render, sitemap, xml }: Module,
  onError?: (e: Error) => void,
) {
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

  app.get('/comment', async (_req, res) => {
    let users = await fetchCache.get();
    res.status(200);
    res.set({ 'Content-Type': 'application/json' });
    res.send(JSON.stringify(users));
  });

  // SSR
  app.use('*', async (req, res) => {
    try {
      const url = '/' + req.originalUrl.replace(BASE, '');
      render(url, res);
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

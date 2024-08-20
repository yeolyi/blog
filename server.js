import express from 'express';
import { Octokit } from 'octokit';
import { config } from 'dotenv';

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

// API
config();

class Cache {
  #timeout;
  #fetchData;

  #value = null;
  #promise = null;

  constructor(fetchData, timeout) {
    this.#fetchData = fetchData;
    this.#timeout = timeout;
  }

  async get() {
    if (this.#value === null) {
      await this.#revalidate();
      return this.#value.value;
    }

    if (this.#passedTime() < this.#timeout) {
      return this.#value.value;
    } else {
      await this.#revalidate();
      return this.#value.value;
    }
  }

  async #revalidate() {
    console.log(this.#promise);

    if (this.#promise !== null) {
      await this.#promise;
      return this.#value.value;
    }

    this.#promise = this.#fetchData();
    this.#value = {
      value: await this.#promise,
      time: Date.now(),
    };

    this.#promise = null;
  }

  #passedTime() {
    return Date.now() - (this.#value.time ?? 0);
  }
}

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

let stargazerCache = new Cache(async () => {
  try {
    let resp = await octokit.request('GET /repos/{owner}/{repo}/', {
      owner: 'yeolyi',
      repo: 'blog',
    });
    return resp.data.stargazers_count;
  } catch {
    return -1;
  }
}, 60 * 1000);

app.get('/stargazer', async (req, res) => {
  res.status(200);
  res.set({ 'Content-Type': 'text/html' });
  res.send(String(await stargazerCache.get()));
});

let headers = new Headers({
  'User-Agent':
    'Instagram 76.0.0.15.395 Android (24/7.0; 640dpi; 1440x2560; samsung; SM-G930F; herolte; samsungexynos8890; en_US; 138226743)',
  Origin: 'https://www.instagram.com',
  Referer: 'https://www.instagram.com/',
});

let instagramCache = new Cache(async () => {
  try {
    let resp = await fetch(
      'https://i.instagram.com/api/v1/users/web_profile_info/?username=yeolyii',
      { headers },
    );
    let json = await resp.json();
    return json.data.user.edge_followed_by.count;
  } catch {
    return -1;
  }
}, 60 * 1000);

app.get('/instagram-follower', async (req, res) => {
  res.status(200);
  res.set({ 'Content-Type': 'text/html' });
  res.send(String(await instagramCache.get()));
});

// SSR
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

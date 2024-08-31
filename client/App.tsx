import './index.css';

import { Route, Routes, useLocation } from 'react-router-dom';

import { jsPageList } from './mdx/js/page';
import { webapiPageList } from './mdx/webapi/page';
import { postPageList } from './mdx/post/page';
import { NotFound } from '@/client/page/notfound/NotFound';
import { JSLayout } from './mdx/js/layout';
import { PostLayout } from './mdx/post/layout';
import { WebAPILayout } from './mdx/webapi/layout';
import { useScrollTop } from '@/client/util/useScrollTop';
import { MainPage } from '@/client/page/main/Main';

export let App = ({ cssPath }: { cssPath: string }) => {
  const page = usePage();
  useScrollTop();

  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/svg+xml" href="/favicon.ico" />
        <link rel="stylesheet" href={cssPath} />

        <title>{page.title}</title>
        <meta name="description" content={page.description} />

        <meta property="og:title" content={page.title} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={page.imageSrc} />
        <meta property="og:description" content={page.description} />
        <meta property="og:site_name" content="yeolyi.com" />

        <script
          defer
          data-domain="yeolyi.com"
          src="https://plausible.io/js/script.js"
        />
        {import.meta.env.DEV && <DevScripts />}
      </head>
      <body>
        <Routes>
          <Route path="/" element={<MainPage />} />

          {jsPageList.map((page) => (
            <Route
              key={page.path}
              path={page.path}
              element={<JSLayout {...page} />}
            />
          ))}

          {webapiPageList.map((page) => (
            <Route
              key={page.path}
              path={page.path}
              element={<WebAPILayout {...page} />}
            />
          ))}

          {postPageList.map((page) => (
            <Route
              key={page.path}
              path={page.path}
              element={<PostLayout {...page} />}
            />
          ))}

          <Route path="*" element={<NotFound />} />
        </Routes>
      </body>
    </html>
  );
};

const DevScripts = () => (
  <>
    <script
      type="module"
      dangerouslySetInnerHTML={{
        __html: `import RefreshRuntime from 'http://localhost:5173/@react-refresh';
RefreshRuntime.injectIntoGlobalHook(window);
window.$RefreshReg$ = () => {};
window.$RefreshSig$ = () => (type) => type;
window.__vite_plugin_react_preamble_installed__ = true;`,
      }}
    />
    <script type="module" src="http://localhost:5173/@vite/client" />
    <script type="module" src="http://localhost:5173/client/entry-client.tsx" />
  </>
);

const mainPage = {
  title: '개발자 성열',
  description: '유익하고 바보같고 화가나는 개발자 일상',
  imageSrc: undefined,
};

const pageList = [...jsPageList, ...postPageList, ...webapiPageList];

const usePage = () => {
  const { pathname } = useLocation();
  const page = pageList.find((x) => x.path === pathname);
  return page ?? mainPage;
};

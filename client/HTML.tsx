import { App } from '@/client/App';
import { pageList, mainPage } from '@/client/constants/page';
import { useLocation } from 'react-router-dom';

export const HTML = ({ cssPath }: { cssPath: string }) => {
  const { pathname } = useLocation();

  // 존재하지 않는 페이지에 대해서는 mainPage의 메타데이터 사용
  const page = pageList.find(({ path }) => path === pathname) ?? mainPage;

  return (
    <html lang="ko">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/svg+xml" href="/favicon.ico" />
        <link rel="stylesheet" href={cssPath} />

        <title>{page.title}</title>
        <meta name="description" content={page.description} />

        <meta property="og:title" content={page.title} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={page.src} />
        <meta property="og:description" content={page.description} />
        <meta property="og:site_name" content="yeolyi.com" />

        <script
          defer
          data-domain="yeolyi.com"
          src="https://plausible.io/js/script.js"
        />

        {import.meta.env.DEV && <DevScripts />}
      </head>
      <body className="bg-white dark:bg-black">
        <App />
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

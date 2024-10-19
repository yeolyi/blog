import { App } from '@/client/App';

export const HTML = ({ cssPath }: { cssPath: string }) => {
  return (
    <html lang="ko">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/svg+xml" href="/favicon.ico" />
        <link rel="stylesheet" href={cssPath} />

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

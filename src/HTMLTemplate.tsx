import './index.css';

import { Page } from '@/mdx/page';
import { ReactNode } from 'react';

export const HTMLTemplate = ({
  cssPath,
  title,
  description,
  imageSrc,
  children,
}: {
  cssPath: string;
  children: ReactNode;
} & Pick<Page, 'title' | 'description' | 'imageSrc'>) => {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/svg+xml" href="/favicon.ico" />
        <link rel="stylesheet" href={cssPath} />

        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="og:title" content={title} />
        <meta name="og:description" content={description} />
        <meta name="og:image" content={imageSrc} />

        {import.meta.env.DEV && <DevScripts />}
      </head>
      <body>{children}</body>
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
    <script type="module" src="http://localhost:5173/src/entry-client.tsx" />
  </>
);

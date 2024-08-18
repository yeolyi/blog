import './index.css';

import { Route, Routes } from 'react-router-dom';

import { MainPage } from './routes/main/Main';
import { jsRoutePreview } from './mdx/js/preview';
import MdxLayout from '@/components/layout/MdxLayout';
import { ReactNode } from 'react';
import CodeBlock from '@/components/code/CodeBlock';
import { webapiPreview } from '@/mdx/webapi/preview';
import { RoutePreview } from '@/post';
import { postRoutePreview } from '@/mdx/post/preview';
import manifest from '../dist/client/.vite/manifest.json';
import { NotFound } from '@/routes/notfound/NotFound';

const getMdxRouteList = (
  previewList: RoutePreview[],
  discussionNumber?: number,
) => {
  return (
    <>
      {previewList.map(({ title, description, path, Mdx }) => (
        <Route
          key={path}
          path={path}
          element={
            <HTMLTemplate title={title} description={description}>
              <MdxLayout discussionNumber={discussionNumber}>
                <Mdx components={{ pre: CodeBlock }} />
              </MdxLayout>
            </HTMLTemplate>
          }
        />
      ))}
    </>
  );
};

export let App = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <HTMLTemplate
            title="개발자 성열"
            description="유익하고 바보같고 화가나는 개발자 일상"
          >
            <MainPage />
          </HTMLTemplate>
        }
      />

      {getMdxRouteList(jsRoutePreview, 2)}
      {getMdxRouteList(webapiPreview, 10)}
      {getMdxRouteList(postRoutePreview)}

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const HTMLTemplate = ({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) => (
  <html>
    <head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      {import.meta.env.PROD && (
        <link
          rel="stylesheet"
          href={'/' + manifest['src/entry-client.tsx'].css?.[0]}
        />
      )}
      <title>{title}</title>
      <meta name="description" content={description} />
      {import.meta.env.DEV && (
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
      )}
    </head>
    <body>{children}</body>
  </html>
);

/*
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <!-- <link rel="icon" type="image/svg+xml" href="/vite.svg" /> -->
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <!--app-head-->
  </head>
  <body>
    <div id="root"><!--app-html--></div>
    <script type="module" src="/src/entry-client.tsx"></script>
  </body>
</html>

*/

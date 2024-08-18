import './index.css';

import { Route, Routes, useLocation } from 'react-router-dom';

import { MainPage } from './routes/main/Main';
import { jsRoutePreview } from './mdx/js/preview';
import MdxLayout from '@/components/layout/MdxLayout';
import { ReactNode, useEffect } from 'react';
import CodeBlock from '@/components/code/CodeBlock';
import { webapiPreview } from '@/mdx/webapi/preview';
import { RoutePreview } from '@/mdx/routePreview';
import { postRoutePreview } from '@/mdx/post/preview';
import manifest from '../dist/client/.vite/manifest.json';
import { NotFound } from '@/routes/notfound/NotFound';

const getMdxRouteList = (
  previewList: RoutePreview[],
  discussionNumber?: number,
) => {
  return (
    <>
      {previewList.map((routePreview) => (
        <Route
          key={routePreview.path}
          path={routePreview.path}
          element={
            <HTMLTemplate {...routePreview}>
              <MdxLayout discussionNumber={discussionNumber}>
                <routePreview.Mdx components={{ pre: CodeBlock }} />
              </MdxLayout>
            </HTMLTemplate>
          }
        />
      ))}
    </>
  );
};

export let App = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    scrollTo(0, 0);
  }, [pathname]);

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
  imageSrc,
  children,
}: {
  children: ReactNode;
} & Pick<RoutePreview, 'title' | 'description' | 'imageSrc'>) => (
  <html>
    <head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" type="image/svg+xml" href="/favicon.ico" />
      {import.meta.env.PROD && (
        <link
          rel="stylesheet"
          href={'/' + manifest['src/entry-client.tsx'].css?.[0]}
        />
      )}

      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="og:title" content={title} />
      <meta name="og:description" content={description} />
      <meta name="og:image" content={imageSrc} />

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

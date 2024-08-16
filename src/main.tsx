import './index.css';

import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { MainPage } from './routers/main/Main';
import { jsPostPreview } from './mdx/js/jsPostPreview';
import PostLayout from './components/layout/PostLayout';
import { lazy, Suspense } from 'react';
import CodeBlock from './components/code/CodeBlock';

const JSPost = ({ fileName }: { fileName: string }) => {
  const Mdx = lazy(() => import(`./mdx/js/${fileName}.mdx`));
  return (
    <Suspense>
      <Mdx components={{ pre: CodeBlock }} />
    </Suspense>
  );
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainPage />,
  },
  {
    path: '/js',
    element: <PostLayout discussionNumber={2} />,
    children: jsPostPreview.map(({ fileName }) => ({
      path: fileName,
      element: <JSPost fileName={fileName} />,
    })),
  },
]);

createRoot(document.getElementById('root')!).render(
  <RouterProvider router={router} />,
);

import './index.css';

import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { MainPage } from './routes/main/Main';
import { jsPostPreview } from './mdx/js/preview';
import { lazy, Suspense } from 'react';
import CodeBlock from './components/code/CodeBlock';
import PostLayout from '@/components/layout/PostLayout';
import { postCellProps } from '@/mdx/post/preview';

let JSPost = ({ fileName }: { fileName: string }) => {
  const Mdx = lazy(() => import(`./mdx/js/${fileName}.mdx`));
  return (
    <Suspense>
      <Mdx components={{ pre: CodeBlock }} />
    </Suspense>
  );
};

let Post = ({ fileName }: { fileName: string }) => {
  const Mdx = lazy(() => import(`./mdx/post/${fileName}.mdx`));
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
  {
    path: '/post',
    element: <PostLayout discussionNumber={2} />,
    children: postCellProps.map(({ fileName }) => ({
      path: fileName,
      element: <Post fileName={fileName} />,
    })),
  },
]);

createRoot(document.getElementById('root')!).render(
  <RouterProvider router={router} />,
);

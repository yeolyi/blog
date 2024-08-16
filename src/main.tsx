import './index.css';

import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { MainPage } from './routes/main/Main';
import { jsPostPreview } from './mdx/js/preview';
import { lazy, Suspense } from 'react';
import CodeBlock from './components/code/CodeBlock';
import PostLayout from '@/components/layout/PostLayout';
import { postCellProps } from '@/mdx/post/preview';
import { webapiPreview } from '@/mdx/webapi/preview';

let Post = ({ type, fileName }: { type: string; fileName: string }) => {
  const Mdx = lazy(() => import(`./mdx/${type}/${fileName}.mdx`));
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
      element: <Post type="js" fileName={fileName} />,
    })),
  },
  {
    path: '/webapi',
    element: <PostLayout />,
    children: webapiPreview.map(({ fileName }) => ({
      path: fileName,
      element: <Post type="webapi" fileName={fileName} />,
    })),
  },
  {
    path: '/post',
    element: <PostLayout />,
    children: postCellProps.map(({ fileName }) => ({
      path: fileName,
      element: <Post type="post" fileName={fileName} />,
    })),
  },
]);

createRoot(document.getElementById('root')!).render(
  <RouterProvider router={router} />,
);

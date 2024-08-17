import './index.css';

import { Route, Routes } from 'react-router-dom';

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
    <Suspense fallback={<div className="h-full w-full">ASD</div>}>
      <Mdx components={{ pre: CodeBlock }} />
    </Suspense>
  );
};

export let App = () => {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route element={<PostLayout discussionNumber={2} />}>
        <Route path="js">
          {jsPostPreview.map(({ fileName }) => (
            <Route
              key={fileName}
              path={fileName}
              element={<Post type="js" fileName={fileName} />}
            />
          ))}
        </Route>
      </Route>
      <Route element={<PostLayout discussionNumber={10} />}>
        <Route path="webapi">
          {webapiPreview.map(({ fileName }) => (
            <Route
              key={fileName}
              path={fileName}
              element={<Post type="webapi" fileName={fileName} />}
            />
          ))}
        </Route>
      </Route>
      <Route element={<PostLayout discussionNumber={10} />}>
        <Route path="post">
          {postCellProps.map(({ fileName }) => (
            <Route
              key={fileName}
              path={fileName}
              element={<Post type="post" fileName={fileName} />}
            />
          ))}
        </Route>
      </Route>
    </Routes>
  );
};

import { Route, Routes } from 'react-router-dom';

import { MainPage } from './routes/main/Main';
import { jsPageList } from './mdx/js/page';
import { webapiPageList } from '@/mdx/webapi/page';
import { postPageList } from '@/mdx/post/page';
import { NotFound } from '@/routes/notfound/NotFound';
import { JSLayout } from '@/mdx/js/layout';
import { PostLayout } from '@/mdx/post/layout';
import { WebAPILayout } from '@/mdx/webapi/layout';

export let App = ({ cssPath }: { cssPath: string }) => {
  return (
    <Routes>
      <Route path="/" element={<MainPage cssPath={cssPath} />} />

      {jsPageList.map((page) => (
        <Route
          key={page.path}
          path={page.path}
          element={<JSLayout {...page} cssPath={cssPath} />}
        />
      ))}

      {webapiPageList.map((page) => (
        <Route
          key={page.path}
          path={page.path}
          element={<WebAPILayout {...page} cssPath={cssPath} />}
        />
      ))}

      {postPageList.map((page) => (
        <Route
          key={page.path}
          path={page.path}
          element={<PostLayout {...page} cssPath={cssPath} />}
        />
      ))}

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

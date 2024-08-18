import { Route, Routes } from 'react-router-dom';

import { MainPage } from './routes/main/Main';
import { jsPageList } from './mdx/js/page';
import { webapiPageList } from '@/mdx/webapi/page';
import { postPageList } from '@/mdx/post/page';
import { NotFound } from '@/routes/notfound/NotFound';
import { JSLayout } from '@/mdx/js/layout';
import { PostLayout } from '@/mdx/post/layout';
import { WebAPILayout } from '@/mdx/webapi/layout';

export let App = () => {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />

      {jsPageList.map((page) => (
        <Route
          key={page.path}
          path={page.path}
          element={<JSLayout {...page} />}
        />
      ))}

      {webapiPageList.map((page) => (
        <Route
          key={page.path}
          path={page.path}
          element={<WebAPILayout {...page} />}
        />
      ))}

      {postPageList.map((page) => (
        <Route
          key={page.path}
          path={page.path}
          element={<PostLayout {...page} />}
        />
      ))}

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

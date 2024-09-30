import './index.css';

import { Route, Routes } from 'react-router-dom';

import { jsPageList } from './mdx/js';
import { webapiPageList } from './mdx/webapi';
import { postPageList } from './mdx/post';
import MdxLayout from '@/client/pages/[mdx]/layout';
import { notFoundPage } from '@/client/constants/page';
import { MainPage } from '@/client/pages';

export const App = () => {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />

      {jsPageList.map((page) => (
        <Route
          key={page.path}
          path={page.path}
          element={<MdxLayout discussionNumber={2} mdxPage={page} />}
        />
      ))}

      {webapiPageList.map((page) => (
        <Route
          key={page.path}
          path={page.path}
          element={<MdxLayout discussionNumber={10} mdxPage={page} />}
        />
      ))}

      {postPageList.map((page) => (
        <Route
          key={page.path}
          path={page.path}
          element={<MdxLayout mdxPage={page} />}
        />
      ))}

      <Route path="*" element={<MdxLayout mdxPage={notFoundPage} />} />
    </Routes>
  );
};

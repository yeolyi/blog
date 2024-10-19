import './index.css';

import { jsPageList } from './mdx/js';
import { webapiPageList } from './mdx/webapi';
import { postPageList } from './mdx/post';
import MdxLayout from '@/client/pages/[mdx]/layout';
import { notFoundPage } from '@/client/constants/page';
import { MainPage } from '@/client/pages';
import { useLocation } from 'wouter';

export const App = () => {
  const [location] = useLocation();

  // TODO: 왜 switch + route 조합으로는 안되지??
  // 상태가 날아갔었나 이 주석 왜 적었었지
  if (location === '/') return <MainPage />;
  else if (location.startsWith('/js')) {
    return (
      <MdxLayout
        discussionNumber={2}
        mdxPage={jsPageList.find((x) => x.path === location)!}
      />
    );
  } else if (location.startsWith('/webapi')) {
    return (
      <MdxLayout
        discussionNumber={10}
        mdxPage={webapiPageList.find((x) => x.path === location)!}
      />
    );
  } else if (location.startsWith('/post')) {
    return (
      <MdxLayout mdxPage={postPageList.find((x) => x.path === location)!} />
    );
  } else {
    return <MdxLayout mdxPage={notFoundPage} />;
  }
};

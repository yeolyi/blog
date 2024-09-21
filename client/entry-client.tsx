import 'vite/modulepreload-polyfill';

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HTML } from '@/client/HTML';

ReactDOM.hydrateRoot(
  document,
  <React.StrictMode>
    <BrowserRouter>
      <HTML
        // @ts-expect-error 외부에서 주입한 변수
        cssPath={window.cssPath}
      />
    </BrowserRouter>
  </React.StrictMode>,
);

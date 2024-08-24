import 'vite/modulepreload-polyfill';

import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from '@/client/App';
import { BrowserRouter } from 'react-router-dom';

ReactDOM.hydrateRoot(
  document,
  <React.StrictMode>
    <BrowserRouter>
      {/* @ts-ignore */}
      <App path={location.pathname} cssPath={window.cssPath} />
    </BrowserRouter>
  </React.StrictMode>,
);

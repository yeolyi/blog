import 'vite/modulepreload-polyfill';

import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from '@/App';
import { BrowserRouter } from 'react-router-dom';

ReactDOM.hydrateRoot(
  document,
  <React.StrictMode>
    <BrowserRouter>
      {/* @ts-ignore */}
      <App cssPath={window.cssPath} />
    </BrowserRouter>
  </React.StrictMode>,
);

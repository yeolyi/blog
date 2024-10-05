import 'vite/modulepreload-polyfill';

import React from 'react';
import ReactDOM from 'react-dom/client';
import { HTML } from '@/client/HTML';
import { Router } from 'wouter';

ReactDOM.hydrateRoot(
  document,
  <React.StrictMode>
    <Router>
      <HTML
        // @ts-expect-error 외부에서 주입한 변수
        cssPath={window.cssPath}
      />
    </Router>
  </React.StrictMode>,
);

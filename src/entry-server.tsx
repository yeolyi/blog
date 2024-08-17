import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { App } from '@/App';

export const render = (location: string) => {
  const html = renderHTML(location);

  return { html };
};

export const renderHTML = (location: string) => {
  return ReactDOMServer.renderToString(
    <React.StrictMode>
      <StaticRouter location={location}>
        <App />
      </StaticRouter>
    </React.StrictMode>,
  );
};

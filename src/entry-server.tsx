import React from 'react';
import { StaticRouter } from 'react-router-dom/server';
import { App } from '@/App';
import {
  renderToPipeableStream,
  RenderToPipeableStreamOptions,
} from 'react-dom/server';

export const render = (
  url: string,
  _ssrManifest?: string,
  options?: RenderToPipeableStreamOptions,
) => {
  return renderToPipeableStream(
    <React.StrictMode>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </React.StrictMode>,
    options,
  );
};

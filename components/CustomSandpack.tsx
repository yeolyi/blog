'use client';

import {
  SandpackCodeEditor,
  SandpackConsole,
  SandpackPreview,
  SandpackProvider,
  SandpackTheme,
} from '@codesandbox/sandpack-react';

export default function CustomSandpack({
  type,
  code,
}: {
  type: 'preview' | 'console';
  code: string;
}) {
  return (
    <SandpackProvider
      template="vanilla"
      theme={githubLight}
      files={{ '/index.js': { code } }}
      options={{ recompileDelay: 800 }}
    >
      <div className="relative mb-4 border">
        <SandpackCodeEditor className="overflow-scroll" />
        <div className="m-2 border border-dashed">
          {type === 'preview' && (
            <SandpackPreview showOpenInCodeSandbox={false} showRefreshButton={false} />
          )}
          {type === 'console' && (
            <SandpackConsole
              showSyntaxError
              standalone
              resetOnPreviewRestart
              style={{ height: 200 }}
            />
          )}
        </div>
      </div>
    </SandpackProvider>
  );
}

export const githubLight: SandpackTheme = {
  colors: {
    surface1: '#ffffff',
    surface2: '#F3F3F3',
    surface3: '#f5f5f5',
    clickable: '#959da5',
    base: '#24292e',
    disabled: '#d1d4d8',
    hover: '#24292e',
    accent: '#24292e',
  },
  syntax: {
    keyword: '#d73a49',
    property: '#005cc5',
    plain: '#24292e',
    static: '#032f62',
    string: '#032f62',
    definition: '#6f42c1',
    punctuation: '#24292e',
    tag: '#22863a',
    comment: {
      color: '#6a737d',
      fontStyle: 'normal',
    },
  },
  font: {
    body: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
    mono: '"Fira Code", "DejaVu Sans Mono", Menlo, Consolas, "Liberation Mono", Monaco, "Lucida Console", monospace',
    size: '1rem',
    lineHeight: '1.75',
  },
};

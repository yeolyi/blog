'use client';

import {
  SandpackCodeEditor,
  SandpackConsole,
  SandpackPreview,
  SandpackProvider,
  SandpackTests,
  SandpackTheme,
} from '@codesandbox/sandpack-react';

const TEST_SPLIT = '// jest';

export default function CustomSandpack({
  type,
  code,
}: {
  type: 'preview' | 'console' | 'test';
  code: string;
}) {
  const indexJS = type === 'test' ? code.split(TEST_SPLIT)[0].trim() : code;

  const test = code.split(TEST_SPLIT)[1]?.trim();

  return (
    <SandpackProvider
      template="vanilla"
      theme={githubLight}
      files={{ '/index.js': { code: indexJS }, '/index.test.js': { code: test } }}
      options={{ recompileDelay: 800 }}
    >
      <div className="relative mb-4 border">
        <SandpackCodeEditor className="overflow-scroll" showTabs={false} />
        <div
          className="m-2 resize-y overflow-auto border border-dashed"
          style={{ height: type === 'test' ? 140 : 100 }}
        >
          {type === 'preview' && (
            <SandpackPreview showOpenInCodeSandbox={false} showRefreshButton={false} />
          )}

          {type === 'console' && (
            <SandpackConsole showSyntaxError standalone resetOnPreviewRestart />
          )}

          {type === 'test' && (
            <SandpackTests
              verbose={false}
              showVerboseButton={false}
              showWatchButton={false}
              style={{ width: '100%', height: '100%' }}
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
    size: '0.9rem',
    lineHeight: '1.75',
  },
};

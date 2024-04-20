'use client';

import {
  SandpackCodeEditor,
  SandpackConsole,
  SandpackLayoutProps,
  SandpackPreview,
  SandpackProvider,
  SandpackTests,
  SandpackTheme,
  useSandpack,
} from '@codesandbox/sandpack-react';
import { forwardRef, useCallback } from 'react';

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
      files={{
        '/index.js': { code: indexJS },
        '/index.test.js': { code: test },
      }}
      options={{ recompileDelay: 800 }}
    >
      <SandpackLayout>
        <div className="not-prose relative mb-4 border">
          <SandpackCodeEditor className="overflow-scroll" showTabs={false} />
          <div
            className="m-2 resize-y overflow-auto border border-dashed"
            style={{ height: type === 'test' ? 140 : 100 }}
          >
            {type === 'preview' && (
              <SandpackPreview
                showOpenInCodeSandbox={false}
                showRefreshButton={false}
              />
            )}

            {type === 'console' && (
              <SandpackConsole
                showSyntaxError
                standalone
                resetOnPreviewRestart
              />
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
      </SandpackLayout>
    </SandpackProvider>
  );
}

// 이유는 모르겠는데 없으면 개발 서버에서 동작 안함
const SandpackLayout = forwardRef<HTMLDivElement, SandpackLayoutProps>(
  ({ children, className, ...props }, ref) => {
    const { sandpack } = useSandpack();
    const combinedRef = useCombinedRefs(sandpack.lazyAnchorRef, ref);

    return (
      <div ref={combinedRef} {...props}>
        {children}
      </div>
    );
  },
);

SandpackLayout.displayName = 'SandpackLayout';

const useCombinedRefs = <T,>(...refs: Array<React.Ref<T>>): React.Ref<T> =>
  useCallback(
    (element: T) =>
      refs.forEach((ref) => {
        if (!ref) {
          return;
        }

        // Ref can have two types - a function or an object. We treat each case.
        if (typeof ref === 'function') {
          return ref(element);
        }

        // As per https://github.com/facebook/react/issues/13029
        // it should be fine to set current this way.
        (ref as any).current = element;
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    refs,
  );

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
    size: '0.9em',
    lineHeight: '1.75',
  },
};

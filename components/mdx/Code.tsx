'use client';

import {
  SandpackConsole,
  SandpackPreview,
  type SandpackProps,
  SandpackProvider,
  defaultDark,
} from '@codesandbox/sandpack-react';
import dynamic from 'next/dynamic';

// TODO
// 안하니까 hydration error 뜸 흠......
const SandpackCodeEditor = dynamic(
  () =>
    import('@codesandbox/sandpack-react').then((mod) => mod.SandpackCodeEditor),
  {
    ssr: false,
  },
);

export default function Code(
  props: SandpackProps & { showTabs?: boolean; activeFile?: string },
) {
  return (
    <SandpackProvider
      className="not-prose"
      theme={{
        ...defaultDark,
        font: {
          ...defaultDark.font,
          body: 'var(--font-monoplex-kr)',
          mono: 'var(--font-monoplex-kr)',
          size: '14px',
        },
      }}
      template="react"
      {...props}
      files={{
        // Strict Mode 제거
        '/index.js': {
          hidden: true,
          code: `import React from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import App from "./App";
const root = createRoot(document.getElementById("root"));
root.render(<App />);
`,
        },
        ...props.files,
      }}
      options={{
        ...props.options,
        bundlerURL: 'https://sandpack.yeolyi.com',
        recompileDelay: 1000,
      }}
    >
      <>
        <SandpackCodeEditor
          className="h-fit"
          showTabs={props.showTabs ?? false}
          showLineNumbers={false}
          showInlineErrors={false}
        />
        <PreviewWithLog />
      </>
    </SandpackProvider>
  );
}

const PreviewWithLog = () => {
  return (
    <>
      <SandpackPreview showOpenInCodeSandbox={false} />
      <SandpackConsole
        resetOnPreviewRestart
        className="h-fit font-(var(--font-monoplex-kr)) text-base"
        showResetConsoleButton={false}
      />
    </>
  );
};

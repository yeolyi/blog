'use client';

import './style.css';

import {
  SandpackConsole,
  SandpackLayout,
  SandpackPreview,
  type SandpackProps,
  SandpackProvider,
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
      theme="dark"
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
        classes: {
          'sp-editor': 'min-w-[384px]',
          'sp-preview': 'min-w-[200px]',
          'sp-console': 'min-w-[200px]',
        },
        ...props.options,
      }}
    >
      <SandpackLayout>
        <SandpackCodeEditor
          showTabs={props.showTabs ?? false}
          showLineNumbers={false}
          showInlineErrors={false}
        />
        <SandpackPreview />
        <SandpackConsole />
      </SandpackLayout>
    </SandpackProvider>
  );
}

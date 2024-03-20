'use client';

import { SandpackCodeEditor, SandpackPreview, SandpackProvider } from '@codesandbox/sandpack-react';
import { githubLight } from '@codesandbox/sandpack-themes';

export default function HTMLSandpack() {
  return (
    <div className="not-prose">
      <SandpackProvider
        template="vanilla"
        theme={githubLight}
        files={{
          '/index.js': {
            code: `const h1 = document.createElement('h1');
h1.innerText = "Hello, world!";
document.body.appendChild(h1);
`,
          },
        }}
        options={{ recompileDelay: 800 }}
      >
        <div className="flex h-[300px] flex-col border-b border-t border-neutral-200">
          <SandpackCodeEditor className="flex-1" />
          <div className="border-t border-neutral-200" />
          <SandpackPreview
            showOpenInCodeSandbox={false}
            showRefreshButton={false}
            className="flex-1"
          />
        </div>
      </SandpackProvider>
    </div>
  );
}

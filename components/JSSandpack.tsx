'use client';

import { SandpackConsole, SandpackLayout, SandpackProvider } from '@codesandbox/sandpack-react';
import { SandpackCodeEditor } from '@codesandbox/sandpack-react';
import { githubLight } from '@codesandbox/sandpack-themes';

export default function JSSandpack() {
  return (
    <div className="not-prose">
      <SandpackProvider
        template="vanilla"
        theme={githubLight}
        files={{
          '/index.js': {
            code: 'console.log("Hello, world!");',
          },
          '/index.html': {
            code: `<!DOCTYPE html><html><body><script src="index.js"></script></body></html>`,
            hidden: true,
          },
        }}
        options={{
          recompileDelay: 800,
          classes: {
            'sp-layout-height': '100px',
          },
        }}
      >
        <SandpackLayout style={{ height: 100 }}>
          <SandpackCodeEditor className="bg-red flex-1" />
          <SandpackConsole showSyntaxError standalone resetOnPreviewRestart className="flex-1" />
        </SandpackLayout>
      </SandpackProvider>
    </div>
  );
}

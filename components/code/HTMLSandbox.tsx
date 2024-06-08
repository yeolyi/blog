'use client';

import { useState } from 'react';
import CodeEditor from '../CodeEditor';

export default function HTMLSandbox({ code: _code }: { code: string }) {
  const [code, setCode] = useState(_code);

  return (
    <div className="flex flex-col gap-2">
      <CodeEditor code={code} setCode={setCode} language="xml" />
      <iframe srcDoc={code} className="resize-y shadow" />
    </div>
  );
}

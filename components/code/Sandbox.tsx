'use client';

import { useRef } from 'react';
import CodeEditor from './CodeEditor';
import Console from './Console';
import { useInterpret } from './useInterpret';

export default function Sandbox({ code: _code }: { code: string }) {
  const { setIframe, code, setCode, logList } = useInterpret(_code);
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div className="flex flex-col gap-2" ref={containerRef}>
      <CodeEditor code={code} setCode={setCode} />
      <Console logList={logList} />
      <iframe
        sandbox="allow-scripts"
        src="sandbox.html"
        ref={(ref) => setIframe(ref)}
        className="h-0 w-0"
      />
    </div>
  );
}

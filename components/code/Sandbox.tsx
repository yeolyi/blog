'use client';

import { useState } from 'react';
import CodeEditor from './CodeEditor';
import Console from './Console';
import { useInterpret } from './useInterpret';
import { useAppeared } from '@/util/hook';

export default function Sandbox({ code: _code }: { code: string }) {
  const [containerRef, setContainerRef] = useState<HTMLDivElement | null>(null);
  const appeared = useAppeared(containerRef);
  const { setIframe, code, setCode, logList } = useInterpret(_code);

  return (
    <>
      <div className="flex flex-col gap-2" ref={setContainerRef}>
        <CodeEditor code={code} setCode={setCode} />
        <Console logList={logList} />
      </div>
      {appeared && (
        <iframe
          sandbox="allow-scripts"
          src="sandbox.html"
          ref={(ref) => setIframe(ref)}
          className="h-0 w-0"
        />
      )}
    </>
  );
}

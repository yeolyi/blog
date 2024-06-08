'use client';

import { useState } from 'react';
import CodeEditor from '../CodeEditor';
import Console from './Console';
import { useIframe } from './useIframe';
import { useAppeared } from '@/util/hook';

export default function JSSandbox({
  code: _code,
  executable = true,
}: {
  code: string;
  executable?: boolean;
}) {
  const [containerRef, setContainerRef] = useState<HTMLDivElement | null>(null);
  const appeared = useAppeared(containerRef);
  const { setIframe, code, setCode, logList } = useIframe(_code);

  return (
    <>
      <div className="flex flex-col gap-2" ref={setContainerRef}>
        <CodeEditor code={code} setCode={setCode} language="javascript" />
        {executable && <Console logList={logList} />}
      </div>
      {executable && appeared && (
        <iframe
          sandbox="allow-scripts"
          src="/sandbox.html"
          ref={(ref) => setIframe(ref)}
          className="h-0 w-0"
        />
      )}
    </>
  );
}

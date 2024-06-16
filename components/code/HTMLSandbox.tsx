'use client';

import CodeEditor from './CodeEditor';
import Console from './Console';
import RefreshButton from './RefreshButton';
import sandboxSrcdoc from './sandboxSrcdoc';
import { useIframe } from './useIframe';

export default function HTMLSandbox({ code: _code }: { code: string }) {
  const { setIframe, code, setCode, logList, refresh } = useIframe(
    _code,
    'html',
  );

  return (
    <div className="relative flex flex-col gap-2">
      <CodeEditor code={code} setCode={setCode} language="xml" />
      <RefreshButton refresh={refresh} />
      <iframe
        srcDoc={sandboxSrcdoc}
        sandbox="allow-scripts"
        className="resize-y shadow"
        ref={(ref) => setIframe(ref)}
      />
      <Console logList={logList} />
    </div>
  );
}

'use client';

import CodeEditor from './CodeEditor';
import Console from './Console';
import RefreshButton from './RefreshButton';
import sandboxSrcdoc from './sandboxSrcdoc';
import { useIframe } from './useIframe';

export default function JSSandbox({
  code: _code,
  executable = true,
  disableEdit = false,
}: {
  code: string;
  executable?: boolean;
  disableEdit?: boolean;
}) {
  const { setIframe, code, setCode, logList, refresh } = useIframe(_code, 'js');

  return (
    <>
      <div className="relative flex flex-col gap-2 overflow-hidden rounded-[7px]">
        <CodeEditor
          code={code}
          setCode={setCode}
          language="javascript"
          noneditable={!executable || disableEdit}
        />
        {!disableEdit && executable && <RefreshButton refresh={refresh} />}
        {executable && <Console logList={logList} />}
      </div>
      {executable && (
        <iframe
          srcDoc={sandboxSrcdoc}
          sandbox="allow-scripts"
          ref={(ref) => setIframe(ref)}
          className="h-0 w-0"
        />
      )}
    </>
  );
}

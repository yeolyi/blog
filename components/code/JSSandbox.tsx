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
  hideRefresh = false,
  expandedDefault,
}: {
  code: string;
  executable?: boolean;
  disableEdit?: boolean;
  hideRefresh?: boolean;
  expandedDefault?: boolean;
}) {
  const { setIframe, code, setCode, logList, refresh } = useIframe(_code, 'js');

  return (
    <>
      <div className="relative flex flex-col gap-2 rounded-[7px]">
        <CodeEditor
          code={code}
          setCode={setCode}
          language="javascript"
          noneditable={!executable || disableEdit}
        />
        {!hideRefresh && !disableEdit && executable && (
          <RefreshButton refresh={refresh} />
        )}
        {executable && (
          <Console logList={logList} expandedDefault={expandedDefault} />
        )}
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

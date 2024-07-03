'use client';

import { useState } from 'react';
import CodeEditor from '../CodeEditor';
import Console from '../Console';
import RefreshButton from '../RefreshButton';
import { useIframeListener } from './useIframeListener';
import { useDebouncedSrcDoc } from './useDebouncedSrcDoc';
import { PresetName } from '../preset/preset';
import { presetMap } from '../preset/presetMap';

export type SandboxProps = {
  presetName: PresetName;
  code: string;

  executeDisabled?: boolean;
  editDisabled?: boolean;
  refreshDisabled?: boolean;
  logExpanded?: boolean;
};

export default function Sandbox({
  presetName,
  code: _code,

  executeDisabled,
  editDisabled,
  refreshDisabled,
  logExpanded,
}: SandboxProps) {
  let preset = presetMap[presetName];

  const [iframe, setIframe] = useState<HTMLIFrameElement | null>(null);
  const { logList, reset } = useIframeListener(iframe, preset.showIframe);

  const { code, setCode, srcdoc, iframeKey, refresh } = useDebouncedSrcDoc(
    _code,
    preset,
    reset,
  );

  let showConsole = !executeDisabled && preset.showConsole(logList.length);
  let showRefresh = !executeDisabled && !refreshDisabled;

  return (
    <>
      <div className="relative flex flex-col gap-2">
        <CodeEditor
          code={code}
          setCode={setCode}
          language={preset.language}
          noneditable={editDisabled}
        />
        {showRefresh && <RefreshButton refresh={refresh} />}
        {preset.showIframe && (
          <iframe
            key={iframeKey}
            sandbox="allow-scripts"
            className="min-h-[50px] bg-white shadow"
            style={{ height: 0 }}
            ref={(ref) => setIframe(ref)}
            srcDoc={srcdoc}
          />
        )}
        {showConsole && (
          <Console logList={logList} expandedDefault={logExpanded} />
        )}
      </div>
      {!preset.showIframe && (
        <iframe
          key={iframeKey}
          sandbox="allow-scripts"
          className="h-0 w-0"
          ref={(ref) => setIframe(ref)}
          srcDoc={srcdoc}
        />
      )}
    </>
  );
}

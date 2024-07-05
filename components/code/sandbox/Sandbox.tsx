'use client';

import { useEffect, useState } from 'react';
import CodeEditor from '../editor/CodeEditor';
import Console from '../console/Console';
import RefreshButton from '../editor/RefreshButton';
import { useIframeListener } from './useIframeListener';
import { useDebouncedSrcDoc } from './useDebouncedSrcDoc';
import { PresetName } from '../preset/preset';
import { presetMap } from '../preset/presetMap';

export type SandboxOptions = {
  noexec?: boolean;
  noedit?: boolean;
  norefresh?: boolean;
  noiframe?: boolean;

  logExpanded?: boolean;
  iframeHeight?: number;
};

export type SandboxProps = {
  presetName: PresetName;
  code: string;
} & SandboxOptions;

export default function Sandbox({
  presetName,
  code: _code,

  noexec,
  noedit,
  norefresh,
  logExpanded,
  noiframe,
  iframeHeight,
}: SandboxProps) {
  let preset = presetMap[presetName];

  const [iframe, setIframe] = useState<HTMLIFrameElement | null>(null);
  const { logList, reset } = useIframeListener(iframe, {
    listenResize: preset.showIframe && iframeHeight === undefined,
  });

  const { code, setCode, srcdoc, iframeKey, refresh } = useDebouncedSrcDoc(
    _code,
    preset,
    reset,
  );

  let showConsole = !noexec && preset.showConsole(logList.length);
  let showRefresh = !noexec && !norefresh;
  let showIframe = !noiframe && preset.showIframe;

  return (
    <>
      <div className="relative flex flex-col gap-2">
        <CodeEditor
          code={code}
          setCode={setCode}
          language={preset.language}
          noneditable={noedit}
        />
        {showRefresh && <RefreshButton refresh={refresh} />}
        {showIframe && (
          <iframe
            key={iframeKey}
            sandbox="allow-scripts"
            className="bg-white shadow"
            style={{
              height: iframeHeight ? `${iframeHeight}px` : 0,
              minHeight: iframeHeight ? undefined : '200px',
            }}
            ref={(ref) => setIframe(ref)}
            srcDoc={srcdoc}
          />
        )}
        {showConsole && (
          <Console logList={logList} expandedDefault={logExpanded} />
        )}
      </div>
      {!showIframe && (
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

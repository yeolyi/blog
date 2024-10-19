import { useRef, useState } from 'react';

import CodeEditor from '../editor';
import { presetMap, PresetName } from './preset/presetMap';

import Console from '@/client/components/code/sandbox/Console';
import { Toolbar } from '@/client/components/code/sandbox/Toolbar';
import { useIframeListener } from '@/client/components/code/sandbox/hooks/useIframeListener';
import { useOnScreen } from '@/client/components/code/sandbox/hooks/useOnScreen';
import { useDebouncedSrcDoc } from '@/client/components/code/sandbox/hooks/useDebouncedSrcDoc';

// TODO: 옵션 정리...
export type SandboxOptions = {
  noexec?: boolean;
  noedit?: boolean;
  norefresh?: boolean;
  noiframe?: boolean;
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
  noiframe,
  iframeHeight,
}: SandboxProps) {
  const preset = presetMap[presetName];

  // iframe의 메시지 수신
  const [iframe, setIframe] = useState<HTMLIFrameElement | null>(null);
  const { logList, reset } = useIframeListener(iframe);

  // 화면에 보이는지 감지
  const containerRef = useRef<HTMLDivElement>(null);
  const onscreen = useOnScreen(containerRef);

  // 화면이 보이면 iframe으로 메시지 송신
  const { code, setCode, srcdoc, iframeKey, refresh } = useDebouncedSrcDoc(
    _code,
    preset,
    reset,
    onscreen,
  );

  // 옵션에 따라 UI 표시
  const showConsole = !noexec && preset.showConsole;
  const showRefresh = !noexec && !norefresh;
  const showIframe = !noiframe && preset.showIframe;

  return (
    <>
      <div
        className="not-prose relative flex flex-col gap-1"
        ref={containerRef}
      >
        <Toolbar
          refresh={showRefresh ? refresh : undefined}
          presetName={presetName}
        />
        <CodeEditor
          code={code}
          setCode={setCode}
          language={preset.language}
          noneditable={noedit}
        />
        {showIframe && !noexec && (
          <iframe
            key={iframeKey}
            className="bg-white shadow"
            style={{
              height: iframeHeight && `${iframeHeight}px`,
              minHeight: iframeHeight ?? '200px',
            }}
            ref={(ref) => {
              setIframe(ref);
            }}
            srcDoc={srcdoc}
          />
        )}
        {showConsole && <Console logList={logList} />}
      </div>
      {!showIframe && !noexec && (
        <iframe
          key={iframeKey}
          className="h-0 w-0"
          ref={(ref) => {
            setIframe(ref);
          }}
          srcDoc={srcdoc}
        />
      )}
    </>
  );
}

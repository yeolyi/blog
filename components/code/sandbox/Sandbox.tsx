'use client';

import { RefObject, useEffect, useRef, useState } from 'react';
import CodeEditor from '../editor/CodeEditor';
import Console from '../console/Console';
import RefreshButton from '../editor/RefreshButton';
import { useIframeListener } from './useIframeListener';
import { useDebouncedSrcDoc } from './useDebouncedSrcDoc';
import { presetMap, PresetName } from './preset/presetMap';

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
  let containerRef = useRef<HTMLDivElement>(null);
  let onscreen = useOnScreen(containerRef);

  const { logList, reset } = useIframeListener(iframe, {
    listenResize: preset.showIframe && iframeHeight === undefined,
  });

  const { code, setCode, srcdoc, iframeKey, refresh } = useDebouncedSrcDoc(
    _code,
    preset,
    reset,
    onscreen,
  );

  let showConsole = !noexec && preset.showConsole;
  let showRefresh = !noexec && !norefresh;
  let showIframe = !noiframe && preset.showIframe;

  return (
    <>
      <div className={`relative flex flex-col gap-2`} ref={containerRef}>
        <CodeEditor
          code={code}
          setCode={setCode}
          language={preset.language}
          presetName={preset.name}
          noneditable={noedit}
          toolbar={<>{showRefresh && <RefreshButton refresh={refresh} />}</>}
        />
        {showIframe && !noexec && (
          <iframe
            key={iframeKey}
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
      {!showIframe && !noexec && (
        <iframe
          key={iframeKey}
          className="h-0 w-0"
          ref={(ref) => setIframe(ref)}
          srcDoc={srcdoc}
        />
      )}
    </>
  );
}

export function useOnScreen(ref: RefObject<HTMLElement>) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting);
    });

    const currentElement = ref?.current;

    if (currentElement) observer.observe(currentElement);

    return () => {
      if (currentElement) observer.unobserve(currentElement);
    };
  }, [ref]);

  return isVisible;
}

'use client';

import { RefObject, useEffect, useRef, useState } from 'react';
import CodeEditor from '../editor/CodeEditor';
import Console from '../console/Console';
import { useIframeListener } from './useIframeListener';
import { useDebouncedSrcDoc } from './useDebouncedSrcDoc';
import { presetMap, PresetName } from './preset/presetMap';

export type SandboxOptions = {
  noexec?: boolean;
  noedit?: boolean;
  norefresh?: boolean;
  noiframe?: boolean;

  consoleFit?: boolean;
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

  consoleFit,
  noexec,
  noedit,
  norefresh,
  noiframe,
  iframeHeight,
}: SandboxProps) {
  let preset = presetMap[presetName];

  const [iframe, setIframe] = useState<HTMLIFrameElement | null>(null);
  let containerRef = useRef<HTMLDivElement>(null);
  let onscreen = useOnScreen(containerRef);

  const { logList, reset } = useIframeListener(iframe);

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
      <div
        className="not-prose relative flex flex-col gap-1"
        ref={containerRef}
      >
        {/* TODO: 옵션 정리 */}
        {!consoleFit && (
          <div className="flex justify-end gap-3 px-1 font-firacode text-sm text-neutral-300">
            <p className="text-black">{presetName.toLocaleUpperCase()}</p>
            {showRefresh && (
              <button className="hover:text-neutral-400" onClick={refresh}>
                refresh
              </button>
            )}
          </div>
        )}

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
              height: iframeHeight ? `${iframeHeight}px` : 0,
              minHeight: iframeHeight ? undefined : '200px',
            }}
            ref={(ref) => setIframe(ref)}
            srcDoc={srcdoc}
          />
        )}
        {showConsole && <Console logList={logList} fit={consoleFit} />}
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
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { rootMargin: '1000px' },
    );

    const currentElement = ref?.current;

    if (currentElement) observer.observe(currentElement);

    return () => {
      if (currentElement) observer.unobserve(currentElement);
    };
  }, [ref]);

  return isVisible;
}

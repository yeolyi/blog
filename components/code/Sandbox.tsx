'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import CodeEditor from './CodeEditor';
import Console from './Console';
import { Log } from './type';
import { createSrcDoc } from './src/createSrcDoc';

export type SandboxOptions = {
  type: 'js' | 'babel' | 'html';
  executeDisabled?: boolean;
  editDisabled?: boolean;
  refreshDisabled?: boolean;
  logExpanded?: boolean;
};

type CodeType = SandboxOptions['type'];

export default function Sandbox({
  code: _code,
  options,
}: {
  code: string;
  options: SandboxOptions;
}) {
  const [iframe, setIframe] = useState<HTMLIFrameElement | null>(null);
  const { logList, reset } = useIframeListener(iframe, options.type);
  const { code, setCode, srcdoc, iframeKey } = useDebouncedSrcDoc(
    _code,
    options.type,
    reset,
  );

  let showConsole =
    !options.executeDisabled &&
    !(options.type === 'html' && logList.length === 0);

  return (
    <>
      <div className="relative flex flex-col gap-2">
        <CodeEditor
          code={code}
          setCode={setCode}
          language={options.type === 'html' ? 'xml' : 'js'}
          noneditable={options.editDisabled}
        />
        {options.type === 'html' && (
          <iframe
            key={iframeKey}
            sandbox="allow-scripts"
            className="min-h-[50px] resize-y bg-white shadow"
            style={{ height: 0 }}
            ref={(ref) => setIframe(ref)}
            srcDoc={srcdoc}
          />
        )}
        {showConsole && (
          <Console logList={logList} expandedDefault={options.logExpanded} />
        )}
      </div>
      {options.type !== 'html' && (
        // https://velog.io/@younyikim/React%EC%97%90%EC%84%9C-Iframe-%EC%82%AC%EC%9A%A9%EC%8B%9C-%EB%92%A4%EB%A1%9C%EA%B0%80%EA%B8%B0%EA%B0%80-%EB%90%98%EC%A7%80-%EC%95%8A%EB%8A%94-%EB%B2%84%EA%B7%B8
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

let useIframeListener = (iframe: HTMLIFrameElement | null, type: CodeType) => {
  const [logList, setLogList] = useState<Log[]>([]);

  useEffect(() => {
    if (iframe === null) return;

    setLogList([]);

    const handleMessage = (e: MessageEvent) => {
      if (iframe === null) return;
      if (e.origin !== 'null' || e.source !== iframe.contentWindow) return;

      let data = e.data;
      if (data.type === 'height') {
        if (type === 'html') iframe.style.height = data.data;
      } else {
        setLogList((list) => [...list, e.data]);
      }
    };

    addEventListener('message', handleMessage);
    return () => removeEventListener('message', handleMessage);
  }, [iframe, type]);

  let reset = useCallback(() => {
    setLogList([]);
  }, []);

  return { logList, reset };
};

let useDebouncedSrcDoc = (
  _code: string,
  type: CodeType,
  onWait: () => void,
) => {
  const [code, setCode] = useState(_code);
  const [srcdoc, setSrcdoc] = useState('');
  const iframeKey = useRef(0);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') setCode(_code);
  }, [_code]);

  useEffect(() => {
    onWait();
    setSrcdoc(createSrcDoc('', type));

    let id = setTimeout(() => {
      setSrcdoc(createSrcDoc(code, type));
      iframeKey.current++;
    }, 800);

    return () => clearTimeout(id);
  }, [code, onWait, type]);

  return { code, setCode, srcdoc, iframeKey: iframeKey.current };
};

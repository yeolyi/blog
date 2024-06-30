'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import CodeEditor from './CodeEditor';
import Console from './Console';
import { Log } from './log';
import { createSrcDoc } from './createSrcDoc';
import RefreshButton from './RefreshButton';

export type SandboxOptions = (
  | {
      type: 'html';
      iframeHeight?: string;
    }
  | {
      type: 'js';
    }
) & {
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
  const [code, setCode] = useState(_code);
  const [srcdoc, setSrcdoc] = useState('');

  const [iframe, setIframe] = useState<HTMLIFrameElement | null>(null);
  const [logList, setLogList] = useState<Log[]>([]);

  // ugly hack
  // TODO: fix
  const [tmp, setTmp] = useState(0);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') setCode(_code);
  }, [_code]);

  let runCode = useCallback(() => {
    if (iframe === null) return;
    setSrcdoc(createSrcDoc(code, options.type));
  }, [code, iframe, options.type]);

  let refresh = () => {
    setLogList([]);
    setTmp((x) => x + 1);
    runCode();
  };

  useEffect(() => {
    if (iframe === null) return;

    setLogList([]);

    const handleMessage = (e: MessageEvent) => {
      if (iframe === null) return;
      if (e.origin !== 'null' || e.source !== iframe.contentWindow) return;

      let data = e.data;
      if (data.type === 'height') {
        if (options.type === 'html') iframe.style.height = data.data;
      } else {
        setLogList((list) => [...list, e.data]);
      }
    };

    addEventListener('message', handleMessage);
    let id = setTimeout(runCode, 800);

    return () => {
      removeEventListener('message', handleMessage);
      clearTimeout(id);
    };
  }, [code, iframe, options.type, runCode]);

  return (
    <>
      <div className="relative flex flex-col gap-2">
        <CodeEditor
          code={code}
          setCode={setCode}
          language={getCodeEditorLang(options.type)}
          noneditable={options.editDisabled}
        />
        {!options.refreshDisabled && <RefreshButton refresh={refresh} />}
        {options.type === 'html' && (
          <iframe
            sandbox="allow-scripts"
            className="min-h-[50px] resize-y bg-white shadow"
            ref={(ref) => setIframe(ref)}
            srcDoc={srcdoc}
            key={srcdoc}
          />
        )}
        {!options.executeDisabled && !options.editDisabled && (
          <Console logList={logList} expandedDefault={options.logExpanded} />
        )}
      </div>
      {options.type === 'js' && (
        // https://velog.io/@younyikim/React%EC%97%90%EC%84%9C-Iframe-%EC%82%AC%EC%9A%A9%EC%8B%9C-%EB%92%A4%EB%A1%9C%EA%B0%80%EA%B8%B0%EA%B0%80-%EB%90%98%EC%A7%80-%EC%95%8A%EB%8A%94-%EB%B2%84%EA%B7%B8
        <iframe
          sandbox="allow-scripts"
          className="h-0 w-0"
          ref={(ref) => setIframe(ref)}
          srcDoc={srcdoc}
          key={srcdoc + tmp}
        />
      )}
    </>
  );
}

let getCodeEditorLang = (type: CodeType) => {
  return type === 'html' ? 'xml' : 'js';
};

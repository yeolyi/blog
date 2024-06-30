'use client';

import { useEffect, useState } from 'react';
import CodeEditor from './CodeEditor';
import Console from './Console';
import { Log } from './log';

let getSrcDoc = (body: string) => `<!doctype html>
<html>
  <head>
    <style>
      body {
        width: 100%;
        height: 100%;
        background-color: white;
      }
    </style>
  </head>
  <script>
    console.log = (...data) => {
      window.parent.postMessage({
          type: 'log',
          data: data.map((x) => typeof x === 'object' ? x.toString() : String(x)).join(' '),
      }, "*");
    }
  </script>
  <body>${body}</body>
</html>
`;

export default function HTMLSandbox({
  code: _code,
  iframeHeight,
}: {
  code: string;
  iframeHeight?: string;
}) {
  const [iframe, setIframe] = useState<HTMLIFrameElement | null>(null);
  const [code, setCode] = useState(_code);
  const [logList, setLogList] = useState<Log[]>([]);
  const [srcDoc, setSrcDoc] = useState('');

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') setCode(_code);
  }, [_code]);

  useEffect(() => {
    if (iframe === null) return;

    const handleMessage = (e: MessageEvent) => {
      if (e.origin !== 'null' || e.source !== iframe.contentWindow) return;
      setLogList((list) => [...list, e.data]);
    };

    addEventListener('message', handleMessage);

    setLogList([]);

    let id = setTimeout(() => setSrcDoc(getSrcDoc(code)), 800);

    return () => {
      removeEventListener('message', handleMessage);
      clearTimeout(id);
    };
  }, [code, iframe]);

  return (
    <div className="relative flex flex-col gap-2">
      <CodeEditor code={code} setCode={setCode} language="xml" />
      <iframe
        srcDoc={srcDoc}
        sandbox="allow-scripts"
        className="resize-y shadow"
        ref={(ref) => setIframe(ref)}
        style={{ height: iframeHeight }}
      />
      {0 < logList.length && <Console logList={logList} />}
    </div>
  );
}

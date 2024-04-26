import { useRef, useState, useEffect, RefObject, useMemo } from 'react';
import { Log } from './log';

export const useInterpret = (_code: string) => {
  const [iframe, setIframe] = useState<HTMLIFrameElement | null>(null);
  const [code, setCode] = useState(_code);
  const [logList, setLogList] = useState<Log[]>([]);

  useEffect(() => {
    setLogList([]);

    const id = setTimeout(() => {
      iframe?.contentWindow?.postMessage(code, '*');
    }, 800);

    return () => clearTimeout(id);
  }, [code, iframe]);

  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (iframe === null) return;
      if (e.origin === 'null' && e.source === iframe.contentWindow) {
        setLogList((list) => [...list, e.data]);
      }
    };

    addEventListener('message', handleMessage);
    return () => removeEventListener('message', handleMessage);
  }, [iframe]);

  return { code, setCode, setIframe, logList };
};

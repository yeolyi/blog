import { useRef, useState, useEffect } from 'react';
import { Log } from './log';

export const useInterpret = (_code: string) => {
  const ref = useRef<HTMLIFrameElement>(null);
  const [code, setCode] = useState(_code);
  const [logList, setLogList] = useState<Log[]>([]);

  useEffect(() => {
    setLogList([]);

    const id = setTimeout(() => {
      ref.current?.contentWindow?.postMessage(code, '*');
    }, 800);

    return () => clearTimeout(id);
  }, [code]);

  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      const frame = ref.current;
      if (frame === null) return;
      if (e.origin === 'null' && e.source === frame.contentWindow) {
        setLogList((list) => [...list, e.data]);
      }
    };

    addEventListener('message', handleMessage);
    return () => removeEventListener('message', handleMessage);
  }, []);

  return { code, setCode, ref, logList };
};

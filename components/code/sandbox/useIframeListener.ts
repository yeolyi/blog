import { useState, useEffect, useCallback } from 'react';
import { Log } from '../type';

export let useIframeListener = (
  iframe: HTMLIFrameElement | null,
  listenResize: boolean,
) => {
  const [logList, setLogList] = useState<Log[]>([]);

  useEffect(() => {
    if (iframe === null) return;

    setLogList([]);

    const handleMessage = (e: MessageEvent) => {
      if (iframe === null) return;
      if (e.origin !== 'null' || e.source !== iframe.contentWindow) return;

      let data = e.data;
      if (data.type === 'height') {
        if (listenResize) iframe.style.height = data.data;
      } else {
        setLogList((list) => [...list, e.data]);
      }
    };

    addEventListener('message', handleMessage);
    return () => removeEventListener('message', handleMessage);
  }, [iframe, listenResize]);

  let reset = useCallback(() => {
    setLogList([]);
  }, []);

  return { logList, reset };
};

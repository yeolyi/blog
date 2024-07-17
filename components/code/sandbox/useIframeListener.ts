import { useState, useEffect, useCallback } from 'react';
import { Log } from '../type';

export let useIframeListener = (
  iframe: HTMLIFrameElement | null,
  option: { listenResize: boolean },
) => {
  const [logList, setLogList] = useState<Log[]>([]);

  useEffect(() => {
    if (iframe === null) return;

    setLogList([]);

    const handleMessage = (e: MessageEvent) => {
      if (iframe === null) return;
      if (e.source !== iframe.contentWindow) return;
      setLogList((list) => [...list, e.data]);
    };

    addEventListener('message', handleMessage);
    return () => removeEventListener('message', handleMessage);
  }, [iframe, option.listenResize]);

  let reset = useCallback(() => {
    setLogList([]);
  }, []);

  return { logList, reset };
};

import { useCallback, useEffect, useState } from 'react';
import { Log } from '../../type';

export const useIframeListener = (iframe: HTMLIFrameElement | null) => {
  const [logList, setLogList] = useState<Log[]>([]);

  useEffect(() => {
    if (iframe === null) return undefined;

    const handleMessage = (e: MessageEvent) => {
      if (iframe === null) return;
      if (e.source !== iframe.contentWindow) return;
      setLogList((list) => [...list, e.data]);
    };

    addEventListener('message', handleMessage);
    return () => removeEventListener('message', handleMessage);
  }, [iframe]);

  const reset = useCallback(() => {
    setLogList([]);
  }, []);

  return { logList, reset };
};

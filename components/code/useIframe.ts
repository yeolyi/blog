import {
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
  useCallback,
  useRef,
} from 'react';
import { Log } from './log';
import { useLoaded } from '@/util/hook';
import parseCode from '@/util/sandbox';

export const useIframe = (_code: string) => {
  const [iframe, setIframe] = useState<HTMLIFrameElement | null>(null);
  const loaded = useLoaded(iframe);

  const [code, setCode] = useState(_code);
  const [logList, setLogList] = useState<Log[]>([]);

  // dev에서 mdx의 코드블록 변화가 반영되게하기 위함
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') setCode(_code);
  }, [_code]);

  useMessageListener(iframe, setLogList);
  useExecDebounce(iframe, code, setLogList, loaded);

  return { code, setCode, setIframe, logList };
};

const useExecDebounce = (
  iframe: HTMLIFrameElement | null,
  code: string,
  setLogList: Dispatch<SetStateAction<Log[]>>,
  loaded: boolean,
) => {
  const ref = useRef(true);

  const postMessage = useCallback(async () => {
    if (iframe === null || loaded === false) return;
    ref.current = false;

    try {
      const newCode = parseCode(code);
      // globalThis에 있는 변수등을 초기화하기 위함
      iframe.contentWindow?.postMessage('location.reload()', '*');
      iframe.contentWindow?.postMessage(newCode, '*');
    } catch {
      iframe.contentWindow?.postMessage(code, '*');
    }
  }, [code, iframe, loaded]);

  useEffect(() => {
    const id = setTimeout(postMessage, ref.current ? 0 : 800);
    setLogList([]);
    return () => clearTimeout(id);
  }, [postMessage, setLogList]);
};

const useMessageListener = (
  iframe: HTMLIFrameElement | null,
  setLogList: Dispatch<SetStateAction<Log[]>>,
) => {
  useEffect(() => {
    if (iframe === null) return;

    const handleMessage = (e: MessageEvent) => {
      if (e.origin === 'null' && e.source === iframe.contentWindow) {
        setLogList((list) => [...list, e.data]);
      }
    };

    addEventListener('message', handleMessage);
    return () => removeEventListener('message', handleMessage);
  }, [iframe, setLogList]);
};

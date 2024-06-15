import { useState, useEffect, useCallback, useRef } from 'react';
import { Log } from './log';

export const useIframe = (_code: string, type: 'js' | 'html') => {
  const [iframe, setIframe] = useState<HTMLIFrameElement | null>(null);
  const [code, setCode] = useState(_code);
  const [logList, setLogList] = useState<Log[]>([]);
  const cleanup = useRef<undefined | (() => void)>();
  const firstRun = useRef(true);

  // dev에서 mdx의 코드블록 변화가 반영되게하기 위함
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') setCode(_code);
  }, [_code]);

  // Message listener
  useEffect(() => {
    if (iframe === null) return;

    const handleMessage = (e: MessageEvent) => {
      if (e.origin !== 'null' || e.source !== iframe.contentWindow) return;
      setLogList((list) => [...list, e.data]);
    };

    addEventListener('message', handleMessage);
    return () => removeEventListener('message', handleMessage);
  }, [iframe]);

  const debouncedRun = useCallback(
    (ms: number) => {
      const cleanupIfExist = () => cleanup.current && cleanup.current();

      setLogList([]);
      cleanupIfExist();

      const run = () => {
        if (iframe === null) return;
        firstRun.current = false;

        // globalThis에 있는 변수등을 초기화하기 위함
        // ...이었는데 알 수 없는 이유로 setTimeout이 동작을 안해 주석처리
        // TODO: 고치기. 예제 코드에서 var로 선언한 경우만 초기화가 필요해 우선순위가 낮은듯
        // run이 두 번 불리기도 하고 뭔가 이벤트 루프에서 reload와 postMessage 순서가 꼬이는 것 같기도 하고...
        iframe.srcdoc = iframe.srcdoc;

        // 그렇다고 reload를 안하면 새로고침시 setTimeout의 코드가 두 번 실행됨
        // 로그 지우는게 동기 코드에는 영향을 주지만 비동기 요청이됐던건 안지워져서 그런듯

        let f = () => iframe.contentWindow?.postMessage({ type, code }, '*');
        iframe.addEventListener('load', f);

        return () => iframe.removeEventListener('load', f);
      };

      const id = setTimeout(() => (cleanup.current = run()), ms);

      return () => {
        clearTimeout(id);
        cleanupIfExist();
      };
    },
    [code, iframe, type],
  );

  useEffect(
    () => debouncedRun(firstRun.current ? 0 : 800),
    [debouncedRun, firstRun],
  );

  return {
    code,
    setCode,
    setIframe,
    logList,
    refresh: () => debouncedRun(0),
  };
};

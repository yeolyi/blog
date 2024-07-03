import { useState, useRef, useEffect, useCallback } from 'react';
import { Preset } from '../preset/preset';

export let useDebouncedSrcDoc = (
  _code: string,
  preset: Preset,
  resetLog: () => void,
) => {
  const [code, setCode] = useState(_code);
  const [srcdoc, setSrcdoc] = useState('');
  const iframeKey = useRef(0);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') setCode(_code);
  }, [_code]);

  useEffect(() => {
    resetLog();
    setSrcdoc('');

    let id = setTimeout(async () => {
      // https://velog.io/@younyikim/React에서-Iframe-사용시-뒤로가기가-되지-않는-버그
      setSrcdoc(await preset.createSrcDoc(code));
      iframeKey.current++;
    }, 800);

    return () => clearTimeout(id);
  }, [code, preset, resetLog]);

  let refresh = useCallback(() => {
    resetLog();
    iframeKey.current++;
  }, [resetLog]);

  return { code, setCode, srcdoc, iframeKey: iframeKey.current, refresh };
};

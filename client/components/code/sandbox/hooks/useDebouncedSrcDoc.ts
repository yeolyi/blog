import { useCallback, useEffect, useRef, useState } from 'react';

import { Preset } from '../preset/presetMap';

export const useDebouncedSrcDoc = (
  _code: string,
  preset: Preset,
  resetLog: () => void,
  onScreen: boolean,
) => {
  const [code, setCode] = useState(_code);
  const [srcdoc, setSrcdoc] = useState('');
  const iframeKey = useRef(0);

  useEffect(() => {
    if (import.meta.env.DEV) setCode(_code);
  }, [_code]);

  useEffect(() => {
    if (!onScreen) return;

    resetLog();

    setSrcdoc('');
    iframeKey.current++;

    const id = setTimeout(async () => {
      setSrcdoc(await preset.createSrcDoc(code));
      // https://velog.io/@younyikim/React에서-Iframe-사용시-뒤로가기가-되지-않는-버그
      iframeKey.current++;
    }, 800);

    return () => clearTimeout(id);
  }, [code, onScreen, preset, resetLog]);

  const refresh = useCallback(() => {
    resetLog();
    iframeKey.current++;
  }, [resetLog]);

  return { code, setCode, srcdoc, iframeKey: iframeKey.current, refresh };
};

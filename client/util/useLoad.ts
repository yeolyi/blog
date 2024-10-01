import { debounce } from 'es-toolkit';
import { useEffect } from 'react';

export const useLoad = (callback: () => (() => void) | void) => {
  useEffect(() => {
    let clear = () => {};
    const observer = new MutationObserver(
      debounce(() => {
        clear = callback() || (() => {});
        observer.disconnect();
      }, 250),
    );
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      clear();
    };
  }, [callback]);
};

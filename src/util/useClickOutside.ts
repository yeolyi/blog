import { MutableRefObject, useEffect } from 'react';

export const useClickOutside = (
  ref: MutableRefObject<HTMLElement | undefined>,
  callback: () => void,
) => {
  useEffect(() => {
    const handleClickOutside = (event: Event) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [callback, ref]);
};

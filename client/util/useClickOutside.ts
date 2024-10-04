import { MutableRefObject, useEffect } from 'react';

export const useClickOutside = (
  ref: MutableRefObject<HTMLElement | undefined | null>,
  callback: () => void,
) => {
  useEffect(() => {
    const handleClickOutside = (event: Event) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    document.addEventListener('scroll', handleClickOutside);
    return () => {
      document.removeEventListener('scroll', handleClickOutside);
    };
  }, [callback, ref]);
};

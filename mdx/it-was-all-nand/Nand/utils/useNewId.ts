import { useCallback, useRef } from 'react';

export const useNewId = () => {
  const id = useRef(0);
  return useCallback(() => {
    id.current++;
    return id.current.toString();
  }, []);
};

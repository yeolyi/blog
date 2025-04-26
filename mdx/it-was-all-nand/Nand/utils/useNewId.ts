import { useRef } from 'react';

export const useNewId = () => {
  const id = useRef(0);
  return () => {
    id.current++;
    return id.current.toString();
  };
};

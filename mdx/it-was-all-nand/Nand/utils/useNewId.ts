import { useCallback } from 'react';

export const useNewId = () => {
  return useCallback(() => {
    // 단순 숫자로 하니까 노드가 여러 개가 한번에 select돼서 여러개가 지워지는 이슈가 있음.
    return crypto.randomUUID();
  }, []);
};

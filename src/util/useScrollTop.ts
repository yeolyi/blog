import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const useScrollTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    scrollTo(0, 0);
  }, [pathname]);
};

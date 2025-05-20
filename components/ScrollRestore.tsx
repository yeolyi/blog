'use client';

import { useSearchParams } from 'next/navigation';
import { useLayoutEffect } from 'react';

const ScrollRestore = () => {
  const searchParams = useSearchParams();

  useLayoutEffect(() => {
    setTimeout(() => {
      const scrollY = searchParams.get('scrollY');

      if (scrollY) {
        // 스크롤 위치 복원
        window.scrollTo({
          top: Number.parseInt(scrollY, 10),
          behavior: 'instant',
        });

        // 쿼리 파라미터에서 scrollY 제거
        const newParams = new URLSearchParams(searchParams.toString());
        newParams.delete('scrollY');
        const newPathname = window.location.pathname;
        const newSearch = newParams.toString()
          ? `?${newParams.toString()}`
          : '';

        // URL 수정 (히스토리 대체)
        window.history.replaceState({}, '', `${newPathname}${newSearch}`);
      }
      // TODO: 값 최소회
    }, 500);
  }, [searchParams]);

  return null;
};

export default ScrollRestore;

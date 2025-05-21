'use client';

import { initializeAuthListener } from '@/store/session';
import { useEffect } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // 인증 상태 리스너 설정 및 정리 함수 저장
    const unsubscribe = initializeAuthListener();

    // 컴포넌트 언마운트 시 정리
    return () => {
      unsubscribe();
    };
  }, []);

  return <>{children}</>;
}

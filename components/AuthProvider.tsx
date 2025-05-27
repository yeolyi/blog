'use client';

import { initializeAuthListener } from '@/store/session';
import { useEffect } from 'react';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    return initializeAuthListener();
  }, []);

  return <>{children}</>;
}

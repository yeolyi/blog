'use client';

import { signInWithGithub } from '@/app/[locale]/actions';
import { usePathname, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

/**
 * 현재 URL 정보를 자동으로 추적하여 GitHub 로그인 후 현재 페이지로 돌아오는 기능을 제공하는 훅
 * @returns {() => void} 현재 페이지로 리다이렉트하는 GitHub 로그인 함수
 */
export function useSignInWithGithub() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleSignIn = useCallback(() => {
    // 현재 경로와 쿼리 파라미터를 합쳐서 전체 URL 구성
    let fullPath = pathname;
    const params = new URLSearchParams(searchParams);
    if (params.toString()) {
      fullPath += `?${params.toString()}`;
    }

    signInWithGithub(fullPath);
  }, [pathname, searchParams]);

  return handleSignIn;
}

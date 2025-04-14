'use client';

import { signInWithGithub } from '@/app/actions';
import { usePathname, useSearchParams } from 'next/navigation';
import Button from './Button';

export default function LoginButton() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleLogin = () => {
    // 현재 경로와 쿼리 파라미터를 합쳐서 전체 URL 구성
    let fullPath = pathname;
    const params = new URLSearchParams(searchParams);
    if (params.toString()) {
      fullPath += `?${params.toString()}`;
    }

    signInWithGithub(fullPath);
  };

  return <Button onClick={handleLogin}>GitHub 로그인</Button>;
}

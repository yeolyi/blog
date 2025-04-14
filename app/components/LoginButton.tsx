'use client';

import { useSignInWithGithub } from '@/hooks/useSignInWithGithub';
import Button from './Button';

export default function LoginButton() {
  const signInWithGithub = useSignInWithGithub();

  return <Button onClick={signInWithGithub}>GitHub 로그인</Button>;
}

'use client';

import { useSignInWithGithub } from '@/hooks/useSignInWithGithub';
import { Github } from 'lucide-react';
import Button from '../ui/Button';

export default function LoginButton() {
  const signInWithGithub = useSignInWithGithub();

  return (
    <Button theme="gray" onClick={signInWithGithub} Icon={Github}>
      GitHub 로그인
    </Button>
  );
}

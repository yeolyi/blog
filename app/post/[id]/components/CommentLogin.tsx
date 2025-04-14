'use client';

import { useSignInWithGithub } from '@/hooks/useSignInWithGithub';

export default function CommentLogin() {
  const signInWithGithub = useSignInWithGithub();

  return (
    <button
      className="underline cursor-pointer"
      type="button"
      onClick={signInWithGithub}
    >
      로그인
    </button>
  );
}

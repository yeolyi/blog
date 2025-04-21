'use client';

import { useSignInWithGithub } from '@/hooks/useSignInWithGithub';
import { useTranslations } from 'next-intl';
import type { ReactNode } from 'react';

interface CommentLoginProps {
  children?: ReactNode;
}

export default function CommentLogin({ children }: CommentLoginProps) {
  const signInWithGithub = useSignInWithGithub();
  const t = useTranslations('Comment');

  return (
    <button
      className="underline cursor-pointer"
      type="button"
      onClick={signInWithGithub}
    >
      {children || t('login')}
    </button>
  );
}

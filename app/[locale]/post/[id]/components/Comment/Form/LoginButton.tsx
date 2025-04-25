'use client';

import { useSignInWithGithub } from '@/hooks/useSignInWithGithub';
import { useTranslations } from 'next-intl';
import type { ReactNode } from 'react';

export default function LoginButton({ children }: { children: ReactNode }) {
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

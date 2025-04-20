'use server';

import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export async function signInWithGithub(redirectUrl?: string) {
  const supabase = await createClient();
  const isLocalEnv = process.env.NODE_ENV === 'development';

  const callbackUrl = isLocalEnv
    ? 'http://localhost:3000/auth/callback'
    : 'https://yeolyi.com/auth/callback';

  // 리다이렉트 URL이 있다면 next 파라미터로 추가
  const redirectTo = redirectUrl
    ? `${callbackUrl}?next=${encodeURIComponent(redirectUrl)}`
    : callbackUrl;

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: {
      redirectTo,
    },
  });

  if (error) {
    console.error(error);
  }

  if (data.url) {
    redirect(data.url);
  }
}

export async function signOut() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error(error);
  }
}

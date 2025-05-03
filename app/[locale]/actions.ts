'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
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

type SubscribeResult = {
  success: boolean;
  message: string;
};

export async function subscribeEmail(email: string): Promise<SubscribeResult> {
  const supabase = await createClient();

  if (!email || !email.includes('@')) {
    return {
      success: false,
      message: '유효한 이메일 주소를 입력해주세요',
    };
  }

  try {
    // 이메일 중복 확인
    const { data: existingSubscriber } = await supabase
      .from('subscribers')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    if (existingSubscriber) {
      return {
        success: true,
        message: '이미 구독 중이시네요! 감사합니다 :)',
      };
    }

    // 새 구독자 추가
    const { error } = await supabase.from('subscribers').insert([
      {
        email,
        is_active: true,
      },
    ]);

    if (error) {
      console.error('구독 오류:', error);
      return {
        success: false,
        message: '구독 처리 중 오류가 발생했습니다. 다시 시도해주세요.',
      };
    }

    // 캐시 무효화
    revalidatePath('/');

    return {
      success: true,
      message: '구독이 완료되었습니다. 감사합니다!',
    };
  } catch (error) {
    console.error('구독 처리 오류:', error);
    return {
      success: false,
      message: '서버 오류가 발생했습니다. 나중에 다시 시도해주세요.',
    };
  }
}

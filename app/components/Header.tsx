import { signOut } from '@/app/actions';
import { createClient } from '@/utils/supabase/server';
import NextLink from 'next/link';
import { Suspense } from 'react';
import Button from './Button';
import LoginButton from './LoginButton';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 flex justify-between items-center p-4">
      <NextLink
        href="/"
        className="text-[#e0e0e0] text-2xl font-bold no-underline"
      >
        seongyeol
      </NextLink>
      <div className="flex items-center gap-4">
        <Suspense fallback={<div>Loading...</div>}>
          <AuthButton />
        </Suspense>
      </div>
    </header>
  );
}

const AuthButton = async () => {
  const supabase = await createClient();
  const { data: user } = await supabase.auth.getUser();

  if (user.user) {
    // 사용자의 프로필 정보와 등록 번호 가져오기
    const { data: profile } = await supabase
      .from('profiles')
      .select('registration_number')
      .eq('id', user.user.id)
      .single();

    return (
      <div className="flex items-center gap-4">
        {profile && (
          <span className="text-[#e0e0e0] text-sm">
            #{profile.registration_number}번째 개발자님
          </span>
        )}
        <Button onClick={signOut}>로그아웃</Button>
      </div>
    );
  }

  return <LoginButton />;
};

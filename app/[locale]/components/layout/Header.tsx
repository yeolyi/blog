import { signOut } from '@/app/[locale]/actions';
import { Link } from '@/i18n/navigation';
import { createClient } from '@/utils/supabase/server';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import LoginButton from '../content/LoginButton';
import Button from '../ui/Button';

export default function Header() {
  const t = useTranslations('Header');

  return (
    <header className="fixed top-0 left-0 right-0 flex justify-between items-center p-4">
      <Link href="/" className="text-[#e0e0e0] text-2xl font-bold no-underline">
        {t('title')}
      </Link>
      {/* <div className="flex items-center gap-4">
        <Suspense fallback={<div>{t('loading')}</div>}>
          <AuthButton />
        </Suspense>
      </div> */}
    </header>
  );
}

const AuthButton = async () => {
  const supabase = await createClient();
  const { data: user } = await supabase.auth.getUser();
  const t = await getTranslations('Header');

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
            {t('developer', { number: profile.registration_number })}
          </span>
        )}
        <Button onClick={signOut}>{t('logout')}</Button>
      </div>
    );
  }

  return <LoginButton />;
};

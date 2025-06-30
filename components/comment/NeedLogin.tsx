import { useSessionStore } from '@/store/session';
import { useTranslations } from 'next-intl';

export default function NeedLogin() {
  const t = useTranslations('Comment');
  const login = useSessionStore((state) => state.login);
  const isLoading = useSessionStore((state) => state.isLoading);

  return (
    <p className="p-4 text-gray-300">
      {isLoading
        ? t('loading')
        : t.rich('loginRequired', {
            loginLink: (chunks) => (
              <button
                className="underline cursor-pointer"
                type="button"
                onClick={login}
              >
                {chunks}
              </button>
            ),
          })}
    </p>
  );
}

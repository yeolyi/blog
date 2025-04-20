import { routing } from '@/i18n/routing';
import { updateSession } from '@/utils/supabase/middleware';
import createMiddleware from 'next-intl/middleware';
import type { NextRequest } from 'next/server';

const handleI18nRouting = createMiddleware(routing);

export default async function middleware(request: NextRequest) {
  const response = handleI18nRouting(request);

  // 메인화면 경로 확인 (루트 또는 언어 코드만 있는 경로)
  const pathname = request.nextUrl.pathname;
  const homePath = ['/', ...routing.locales.map((locale) => `/${locale}`)];
  const isHomePage = homePath.includes(pathname);

  // 메인화면에서는 updateSession을 호출하지 않음
  if (isHomePage) {
    return response;
  }

  // Since Server Components can't write cookies,
  // you need middleware to refresh expired Auth tokens and store them.
  return await updateSession(request, response);
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)',
};

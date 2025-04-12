import { createBrowserClient } from '@supabase/ssr';

// 싱글턴이라 클라에서 여러번 호출해도 하나의 인스턴스만 반환
export function createClient() {
  return createBrowserClient(
    // biome-ignore lint/style/noNonNullAssertion: 없으면 터지는게 맞음
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    // biome-ignore lint/style/noNonNullAssertion: 없으면 터지는게 맞음
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}

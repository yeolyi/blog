import { createClient } from '@/utils/supabase/server';

export async function getIsAdmin(): Promise<boolean> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return false;
    }

    // 사용자의 프로필 정보 가져오기
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      console.error(profileError);
      return false;
    }

    return profile.role === 'admin';
  } catch (error) {
    console.error('어드민 확인 중 오류 발생:', error);
    return false;
  }
}

/**
 * 현재 사용자가 로그인했는지 확인하는 함수
 * @returns {Promise<boolean>} 로그인 여부
 */
export async function getIsAuthenticated(): Promise<boolean> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    return !!user && !error;
  } catch (error) {
    console.error('인증 확인 중 오류 발생:', error);
    return false;
  }
}

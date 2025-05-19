import supabase from '@/db/createClient';

export const login = async () => {
  supabase.auth.signInWithOAuth({
    provider: 'github',
    options: {
      redirectTo: `${window.location.origin}${window.location.pathname}`,
      queryParams: { next: window.location.pathname },
    },
  });
};

export const logout = async () => {
  await supabase.auth.signOut();
};

export const getUser = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
};

export async function getProfile() {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) throw userError;
  if (!user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select()
    .eq('id', user.id)
    .single()
    .throwOnError();

  // TODO
  if (profile.role === null) throw new Error('role is null');

  return profile;
}

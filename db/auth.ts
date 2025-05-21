import supabase from '@/db';

export const loginToDB = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: {
      redirectTo: `${window.location.origin}${window.location.pathname}?scrollY=${window.scrollY.toString()}`,
    },
  });
  if (error) throw error;
};

export const logoutFromDB = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const getUserFromDB = async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session?.user ?? null;
};

export async function getProfileFromDB() {
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

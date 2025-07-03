import supabase from '@/db';

export const loginToDB = async () => {
	const { error } = await supabase.auth.signInWithOAuth({
		provider: 'github',
		options: {
			redirectTo: `${window.location.origin}${window.location.pathname}`,
		},
	});
	if (error) throw error;
};

export const logoutFromDB = async () => {
	const { error } = await supabase.auth.signOut();
	if (error) throw error;
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
	if (profile.role === null) throw new Error('Role 값을 찾을 수 없습니다.');

	return profile;
}

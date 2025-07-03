import useSWR from 'swr';
import { getProfileFromDB } from '@/db/auth';
import { useSessionStore } from '@/store/session';
import { profileKey } from '@/swr/key';

export const useProfile = () => {
	const session = useSessionStore((state) => state.session);
	return useSWR(session ? profileKey : null, getProfileFromDB);
};

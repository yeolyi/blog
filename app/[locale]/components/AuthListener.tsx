'use client';
import { getProfile } from '@/db/auth';
import supabase from '@/db/createClient';
import { useProfileStore } from '@/store/profile';
import { useEffect } from 'react';

const AuthListener = () => {
  const setProfile = useProfileStore((state) => state.setProfile);

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        supabase.auth.getSession().then(async ({ data: { session } }) => {
          if (session?.user) {
            const profile = await getProfile();
            if (profile) {
              setProfile(profile);
            }
          } else {
            setProfile(null);
          }
        });
      },
    );

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, [setProfile]);

  return null;
};

export default AuthListener;

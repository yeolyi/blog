import type { Profile } from '@/types/helper.types';
import { create } from 'zustand';

type ProfileState = {
  profile: Profile | null;
  setProfile: (profile: Profile | null) => void;
};

export const useProfileStore = create<ProfileState>((set) => ({
  profile: null,
  setProfile: (profile: Profile | null) => set({ profile }),
}));

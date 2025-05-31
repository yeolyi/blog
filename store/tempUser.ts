import { v4 as uuidv4 } from 'uuid';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const TEMP_USER_ID_KEY = 'temp_user_id';

type TempUserState = {
  id: string | null;
  getId: () => string;
};

export const useTempUserStore = create<TempUserState>()(
  persist(
    (set, get) => ({
      id: null,
      getId: () => {
        const { id } = get();
        if (id) return id;

        const newId = uuidv4();
        set({ id: newId });
        return newId;
      },
    }),
    {
      name: TEMP_USER_ID_KEY,
    },
  ),
);

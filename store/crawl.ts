import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCrawlStore = create<{
  urlList: string[];
  setUrlList: (urlList: string[]) => void;
}>()(
  persist(
    (set) => ({
      urlList: [],
      setUrlList: (urlList: string[]) => set({ urlList }),
    }),
    {
      name: 'url-list-storage',
    },
  ),
);

import type { SyncStorage } from 'jotai/vanilla/utils/atomWithStorage';

export const searchParamStorage: SyncStorage<string | null> = {
  getItem(key, initialValue) {
    if (typeof window === 'undefined') return initialValue;
    const params = new URLSearchParams(window.location.search);
    return params.get(key) || initialValue;
  },
  setItem(key, value) {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    window.history.replaceState(null, '', `?${params.toString()}`);
  },
  removeItem(key) {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    params.delete(key);
    window.history.replaceState(null, '', `?${params.toString()}`);
  },
};

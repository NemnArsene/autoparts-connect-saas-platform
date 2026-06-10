import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { appStorageAdapter } from './storage';
import { STORAGE_KEYS } from '@autoparts/shared';

interface ThemeState {
  dark: boolean;
  toggleDark: () => void;
  setDark: (dark: boolean) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      dark: false,
      toggleDark: () => set((state) => ({ dark: !state.dark })),
      setDark: (dark) => set({ dark }),
    }),
    {
      name: STORAGE_KEYS.THEME,
      storage: createJSONStorage(() => appStorageAdapter),
      onRehydrateStorage: () => (state) => {
        // Apply theme to DOM on web load
        if (typeof document !== 'undefined') {
          if (state?.dark) document.documentElement.classList.add('dark');
          else document.documentElement.classList.remove('dark');
        }
      },
    }
  )
);

// We still need a listener in apps/web to sync the DOM when state changes
if (typeof document !== 'undefined') {
  useThemeStore.subscribe((state) => {
    if (state.dark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  });
}

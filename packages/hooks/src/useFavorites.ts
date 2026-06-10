import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { appStorageAdapter } from './storage';
import { STORAGE_KEYS } from '@autoparts/shared';

interface FavoritesState {
  favoriteIds: string[];
  toggleFavorite: (partId: string) => void;
  isFavorite: (partId: string) => boolean;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favoriteIds: [],
      
      toggleFavorite: (partId) => set((state) => {
        if (state.favoriteIds.includes(partId)) {
          return { favoriteIds: state.favoriteIds.filter((id) => id !== partId) };
        }
        return { favoriteIds: [...state.favoriteIds, partId] };
      }),
      
      isFavorite: (partId) => get().favoriteIds.includes(partId),
    }),
    {
      name: STORAGE_KEYS.FAVORITES,
      storage: createJSONStorage(() => appStorageAdapter),
    }
  )
);

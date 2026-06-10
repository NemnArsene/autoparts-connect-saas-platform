import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { appStorageAdapter } from './storage';
import { STORAGE_KEYS } from '@autoparts/shared';

interface NotificationsState {
  readIds: string[];
  markRead: (id: string) => void;
  markAllRead: (ids: string[]) => void;
  isRead: (id: string) => boolean;
}

export const useNotificationsStore = create<NotificationsState>()(
  persist(
    (set, get) => ({
      readIds: [],
      
      markRead: (id) => set((state) => {
        if (!state.readIds.includes(id)) {
          return { readIds: [...state.readIds, id] };
        }
        return state;
      }),

      markAllRead: (ids) => set((state) => {
        const newIds = new Set([...state.readIds, ...ids]);
        return { readIds: Array.from(newIds) };
      }),
      
      isRead: (id) => get().readIds.includes(id),
    }),
    {
      name: STORAGE_KEYS.NOTIF_READ,
      storage: createJSONStorage(() => appStorageAdapter),
    }
  )
);

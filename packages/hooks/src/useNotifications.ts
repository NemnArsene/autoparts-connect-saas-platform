import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { appStorageAdapter } from './storage';
import { STORAGE_KEYS } from '@autoparts/shared';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  date: string;
  type: string;
}

const DEFAULT_NOTIFICATIONS: NotificationItem[] = [
  {
    id: '1',
    title: 'Commande prête au retrait',
    message: 'Votre réservation #RES-8924 pour Plaquette de frein Bosch est prête au retrait.',
    date: "Aujourd'hui à 10:30",
    type: 'order',
  },
  {
    id: '2',
    title: 'Nouveau fournisseur',
    message: 'PartsAuto CI a ajouté 50 nouvelles pièces compatibles avec votre Toyota Corolla.',
    date: 'Hier à 14:15',
    type: 'system',
  },
  {
    id: '3',
    title: 'Promo Flash',
    message: 'Profitez de -20% sur tous les filtres à huile avec le code OIL20.',
    date: 'Il y a 3 jours',
    type: 'promo',
  }
];

interface NotificationsState {
  notifications: NotificationItem[];
  readIds: string[];
  unreadCount: number;
  markRead: (id: string) => void;
  markAllRead: (ids: string[]) => void;
  isRead: (id: string) => boolean;
  markAsRead: () => void;
}

export const useNotificationsStore = create<NotificationsState>()(
  persist(
    (set, get) => ({
      notifications: DEFAULT_NOTIFICATIONS,
      readIds: [],
      unreadCount: DEFAULT_NOTIFICATIONS.length,
      
      markRead: (id) => set((state) => {
        if (!state.readIds.includes(id)) {
          const newReadIds = [...state.readIds, id];
          const unreadCount = state.notifications.filter((n) => !newReadIds.includes(n.id)).length;
          return { readIds: newReadIds, unreadCount };
        }
        return state;
      }),

      markAllRead: (ids) => set((state) => {
        const newIds = new Set([...state.readIds, ...ids]);
        const newReadIds = Array.from(newIds);
        const unreadCount = state.notifications.filter((n) => !newReadIds.includes(n.id)).length;
        return { readIds: newReadIds, unreadCount };
      }),
      
      isRead: (id) => get().readIds.includes(id),

      markAsRead: () => set((state) => {
        const allIds = state.notifications.map((n) => n.id);
        return { readIds: allIds, unreadCount: 0 };
      }),
    }),
    {
      name: STORAGE_KEYS.NOTIF_READ,
      storage: createJSONStorage(() => appStorageAdapter),
    }
  )
);


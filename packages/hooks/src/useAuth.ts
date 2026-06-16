import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { appStorageAdapter } from './storage';
import { STORAGE_KEYS } from '@autoparts/shared';
import type { User, UserRole } from '@autoparts/models';

interface AuthState {
  user: User | null;
  login: (email: string, _pass: string, role: UserRole) => Promise<void>;
  updateProfile: (updates: Partial<Pick<User, 'name' | 'email' | 'phone' | 'avatar' | 'avatarUri'>>) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      
      login: async (email, _pass, role) => {
        // Mock login implementation (will be replaced by Auth API Service)
        const mockUser: User = {
          id: `usr-${Math.floor(Math.random() * 1000)}`,
          name: email.split('@')[0].toUpperCase(),
          email,
          phone: '+225 01 02 03 04 05',
          avatar: email.substring(0, 2).toUpperCase(),
          role,
        };
        set({ user: mockUser });
      },
      
      updateProfile: (updates) => set((state) => ({
        user: state.user ? { ...state.user, ...updates } : null,
      })),
      
      logout: () => set({ user: null }),
    }),
    {
      name: STORAGE_KEYS.AUTH_USER,
      storage: createJSONStorage(() => appStorageAdapter),
    }
  )
);

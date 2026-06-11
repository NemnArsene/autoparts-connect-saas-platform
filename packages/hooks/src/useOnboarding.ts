import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { appStorageAdapter } from './storage';

interface OnboardingState {
  hasSeenOnboarding: boolean;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      hasSeenOnboarding: false,
      completeOnboarding: () => set({ hasSeenOnboarding: true }),
      resetOnboarding: () => set({ hasSeenOnboarding: false }),
    }),
    {
      name: 'autoparts-onboarding',
      storage: createJSONStorage(() => appStorageAdapter),
    }
  )
);

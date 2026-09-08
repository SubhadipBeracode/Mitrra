import { create } from 'zustand';

export const useOnboardingStore = create((set) => ({
  hasCompletedOnboarding: false,
  completeOnboarding: () => set({ hasCompletedOnboarding: true }),
}));
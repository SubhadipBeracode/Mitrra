import { create } from 'zustand';

export const useThemeStore = create((set) => ({
  mode: 'dark', // default theme
  toggleTheme: () =>
    set((state) => ({ mode: state.mode === 'dark' ? 'light' : 'dark' })),
}));
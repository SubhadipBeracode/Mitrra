import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { signupUser, loginUser, getCurrentUser, deleteAccount } from '../api/auth';
import { useUserStore } from './useUserStore';

export const useAuthStore = create((set) => ({
  isAuthenticated: false,
  token: null,
  loading: false,
  error: null,
  isRestoring: true,

  signup: async (name, email, password) => {
    set({ loading: true, error: null });
    try {
      const data = await signupUser(name, email, password);
      await SecureStore.setItemAsync('authToken', data.token);
      useUserStore.getState().setUser(data.user);
      set({
        isAuthenticated: true,
        token: data.token,
        loading: false,
      });
      return true;
    } catch (error) {
      set({ error: error.message, loading: false });
      return false;
    }
  },

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const data = await loginUser(email, password);
      await SecureStore.setItemAsync('authToken', data.token);
      useUserStore.getState().setUser(data.user);
      set({
        isAuthenticated: true,
        token: data.token,
        loading: false,
      });
      return true;
    } catch (error) {
      set({ error: error.message, loading: false });
      return false;
    }
  },

  logout: async () => {
    await SecureStore.deleteItemAsync('authToken');
    useUserStore.getState().setUser({ name: '', email: '', avatarUrl: null });
    set({ isAuthenticated: false, token: null });
  },

  deleteAccountAndLogout: async () => {
    try {
      await deleteAccount();
      await SecureStore.deleteItemAsync('authToken');
      useUserStore.getState().setUser({ name: '', email: '', avatarUrl: null });
      set({ isAuthenticated: false, token: null });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  restoreSession: async () => {
    try {
      const token = await SecureStore.getItemAsync('authToken');

      if (!token) {
        set({ isAuthenticated: false, isRestoring: false });
        return;
      }

      set({ token });

      const userData = await getCurrentUser();
      useUserStore.getState().setUser(userData);

      set({ isAuthenticated: true, isRestoring: false });
    } catch (error) {
      await SecureStore.deleteItemAsync('authToken');
      set({ isAuthenticated: false, token: null, isRestoring: false });
    }
  },
}));
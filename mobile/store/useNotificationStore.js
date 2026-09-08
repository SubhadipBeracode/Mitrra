import { create } from 'zustand';
import { registerForPushNotificationsAsync } from '../utils/registerForPushNotifications';
import { updateNotificationSettings } from '../api/notifications';

export const useNotificationStore = create((set, get) => ({
  pushToken: null,
  notificationTime: null,

  initializePush: async () => {
    const token = await registerForPushNotificationsAsync();
    if (token) {
      set({ pushToken: token });
      const currentTime = get().notificationTime;
      await updateNotificationSettings(token, currentTime);
    }
  },

  setNotificationTime: async (time) => {
    set({ notificationTime: time });
    const token = get().pushToken;
    try {
      await updateNotificationSettings(token, time);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
}));
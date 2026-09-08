import authenticatedFetch from './apiClient';

export async function updateNotificationSettings(pushToken, notificationTime) {
  return authenticatedFetch('/notifications/settings', {
    method: 'PATCH',
    body: JSON.stringify({ pushToken, notificationTime }),
  });
}
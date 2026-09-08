import axios from 'axios';

export const sendPushNotification = async (pushToken, title, body, data = {}) => {
  if (!pushToken) return { success: false, error: 'No push token' };

  try {
    await axios.post('https://exp.host/--/api/v2/push/send', {
      to: pushToken,
      sound: 'default',
      title,
      body,
      data,
    }, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    return { success: true };
  } catch (error) {
    console.error('Push notification failed:', error.message);
    return { success: false, error: error.message };
  }
};
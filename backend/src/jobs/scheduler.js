import cron from 'node-cron';
import User from '../models/user.js';
import { sendPushNotification } from '../notifications/sendPushNotification.js';

export const startScheduler = () => {
  cron.schedule('* * * * *', async () => {
    await checkAndSendNotifications();
  });

  console.log('Notification checker initialized — runs every minute');
};

const checkAndSendNotifications = async () => {
  try {
    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const usersToNotify = await User.find({
      notificationTime: currentTime,
      pushToken: { $ne: null },
    });

    for (const user of usersToNotify) {
      await sendPushNotification(
        user.pushToken,
        'Your Daily Digest is Ready 🎧',
        'Tap to listen to your personalized briefing.'
      );
      console.log(`Notification sent to ${user.email} at ${currentTime}`);
    }
  } catch (error) {
    console.error('Notification check failed:', error.message);
  }
};
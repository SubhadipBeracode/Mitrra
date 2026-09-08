import User from '../models/user.js';

export const updateNotificationSettings = async (req, res) => {
  try {
    const { pushToken, notificationTime } = req.body;

    const updates = {};
    if (pushToken !== undefined) updates.pushToken = pushToken;
    if (notificationTime !== undefined) updates.notificationTime = notificationTime;

    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true }).select('-password');

    res.status(200).json({
      pushToken: user.pushToken,
      notificationTime: user.notificationTime,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update notification settings', error: error.message });
  }
};
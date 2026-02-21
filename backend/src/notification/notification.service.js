const Notification = require("../models/Notification");

async function listNotifications(userId) {
  const notifications = await Notification.find({ user: userId }).sort({ createdAt: -1 }).limit(50);
  return notifications.map((notification) => ({
    id: notification._id,
    message: notification.message,
    read: notification.read,
    createdAt: notification.createdAt
  }));
}

async function markRead(notificationId, userId) {
  const notification = await Notification.findOne({ _id: notificationId, user: userId });
  if (!notification) {
    const err = new Error("Notification not found");
    err.status = 404;
    throw err;
  }
  notification.read = true;
  await notification.save();
  return notification;
}

module.exports = { listNotifications, markRead };

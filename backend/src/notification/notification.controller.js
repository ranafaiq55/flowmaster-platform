const notificationService = require("./notification.service");

async function list(req, res, next) {
  try {
    const notifications = await notificationService.listNotifications(req.user._id);
    res.json({ notifications });
  } catch (err) {
    next(err);
  }
}

async function markRead(req, res, next) {
  try {
    const notification = await notificationService.markRead(req.params.notificationId, req.user._id);
    res.json({ notification: { id: notification._id, read: notification.read } });
  } catch (err) {
    next(err);
  }
}

module.exports = { list, markRead };

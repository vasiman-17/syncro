const Notification = require("../models/Notification");
const asyncHandler = require("../utils/asyncHandler");

const getMyNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(50);
  res.status(200).json({ success: true, notifications });
});

const markNotificationRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id);
  if (!notification) {
    res.status(404);
    throw new Error("Notification not found");
  }
  if (String(notification.user) !== String(req.user._id)) {
    res.status(403);
    throw new Error("Not allowed");
  }
  notification.readAt = new Date();
  await notification.save();
  res.status(200).json({ success: true, notification });
});

module.exports = { getMyNotifications, markNotificationRead };

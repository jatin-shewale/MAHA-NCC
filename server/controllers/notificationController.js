import { Notification } from "../models/Notification.js";
import { createNotification } from "../services/notificationService.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { paginate } from "../utils/helpers.js";

export const listNotifications = asyncHandler(async (req, res) => {
  const { page, limit, skip } = paginate(req.query);
  const query =
    req.user.role === "Admin"
      ? {}
      : {
          $or: [{ recipients: req.user._id }, { isBroadcast: true }]
        };

  const [items, total] = await Promise.all([
    Notification.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Notification.countDocuments(query)
  ]);

  res.json({ success: true, data: items, pagination: { total, page, limit, pages: Math.ceil(total / limit) } });
});

export const createAnnouncement = asyncHandler(async (req, res) => {
  const notification = await createNotification({
    title: req.body.title,
    message: req.body.message,
    type: req.body.type || "Announcement",
    isBroadcast: true
  });

  res.status(201).json({ success: true, message: "Announcement broadcast successfully", data: notification });
});

export const markNotificationRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id);
  if (!notification) {
    return res.status(404).json({ success: false, message: "Notification not found" });
  }

  const alreadyRead = notification.readBy.some((entry) => entry.user.toString() === req.user._id.toString());
  if (!alreadyRead) {
    notification.readBy.push({ user: req.user._id, readAt: new Date() });
    await notification.save();
  }

  res.json({ success: true, message: "Notification marked as read", data: notification });
});

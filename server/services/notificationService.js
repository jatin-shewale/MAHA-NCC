import { Notification } from "../models/Notification.js";

export const createNotification = async ({ title, message, type, recipients = [], isBroadcast = false, metadata }) =>
  Notification.create({
    title,
    message,
    type,
    recipients,
    isBroadcast,
    metadata
  });

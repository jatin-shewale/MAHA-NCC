import mongoose from "mongoose";
import { NOTIFICATION_TYPE } from "../utils/constants.js";

const notificationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: Object.values(NOTIFICATION_TYPE),
      default: NOTIFICATION_TYPE.SYSTEM
    },
    recipients: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],
    isBroadcast: {
      type: Boolean,
      default: false
    },
    readBy: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User"
        },
        readAt: Date
      }
    ],
    metadata: mongoose.Schema.Types.Mixed
  },
  { timestamps: true }
);

notificationSchema.index({ recipients: 1, createdAt: -1 });

export const Notification = mongoose.model("Notification", notificationSchema);

import mongoose from "mongoose";
import { ACHIEVEMENT_STATUS } from "../utils/constants.js";

const achievementSchema = new mongoose.Schema(
  {
    cadet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: String,
    certificateUrl: {
      type: String,
      required: true
    },
    approvalStatus: {
      type: String,
      enum: Object.values(ACHIEVEMENT_STATUS),
      default: ACHIEVEMENT_STATUS.PENDING
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    reviewedAt: Date
  },
  { timestamps: true }
);

achievementSchema.index({ cadet: 1, approvalStatus: 1 });
achievementSchema.index({ title: "text" });

export const Achievement = mongoose.model("Achievement", achievementSchema);

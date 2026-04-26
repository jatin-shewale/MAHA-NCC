import mongoose from "mongoose";
import { ATTENDANCE_STATUS } from "../utils/constants.js";

const attendanceSchema = new mongoose.Schema(
  {
    cadet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    date: {
      type: Date,
      required: true
    },
    status: {
      type: String,
      enum: Object.values(ATTENDANCE_STATUS),
      required: true
    },
    remarks: String,
    markedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    qrToken: String
  },
  { timestamps: true }
);

attendanceSchema.index({ cadet: 1, date: -1 }, { unique: true });

export const Attendance = mongoose.model("Attendance", attendanceSchema);

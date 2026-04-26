import mongoose from "mongoose";
import { CAMP_STATUS } from "../utils/constants.js";

const campApplicantSchema = new mongoose.Schema(
  {
    cadet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    status: {
      type: String,
      enum: ["Applied", "Approved", "Rejected"],
      default: "Applied"
    },
    appliedAt: {
      type: Date,
      default: Date.now
    }
  },
  { _id: false }
);

const campSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    capacity: { type: Number, required: true, min: 1 },
    applicants: [campApplicantSchema],
    status: {
      type: String,
      enum: Object.values(CAMP_STATUS),
      default: CAMP_STATUS.UPCOMING
    }
  },
  { timestamps: true }
);

campSchema.index({ title: "text", location: "text" });
campSchema.index({ status: 1, startDate: 1 });

export const Camp = mongoose.model("Camp", campSchema);

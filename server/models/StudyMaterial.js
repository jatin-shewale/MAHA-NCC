import mongoose from "mongoose";
import { MATERIAL_VISIBILITY } from "../utils/constants.js";

const studyMaterialSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    category: {
      type: String,
      required: true,
      trim: true
    },
    fileUrl: {
      type: String,
      required: true
    },
    visibility: {
      type: String,
      enum: Object.values(MATERIAL_VISIBILITY),
      default: MATERIAL_VISIBILITY.ALL
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: true }
);

studyMaterialSchema.index({ title: "text", category: "text" });

export const StudyMaterial = mongoose.model("StudyMaterial", studyMaterialSchema);

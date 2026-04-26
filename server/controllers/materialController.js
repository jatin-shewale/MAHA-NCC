import { StatusCodes } from "http-status-codes";
import { StudyMaterial } from "../models/StudyMaterial.js";
import { AppError } from "../utils/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { MATERIAL_VISIBILITY } from "../utils/constants.js";
import { paginate } from "../utils/helpers.js";

export const listMaterials = asyncHandler(async (req, res) => {
  const { page, limit, skip } = paginate(req.query);
  const role = req.user?.role;

  const visibilityQuery =
    role === "Admin"
      ? {}
      : {
          visibility: {
            $in: [MATERIAL_VISIBILITY.ALL, MATERIAL_VISIBILITY.CADETS_ONLY]
          }
        };

  const [items, total] = await Promise.all([
    StudyMaterial.find(visibilityQuery).sort({ createdAt: -1 }).skip(skip).limit(limit),
    StudyMaterial.countDocuments(visibilityQuery)
  ]);

  res.json({ success: true, data: items, pagination: { total, page, limit, pages: Math.ceil(total / limit) } });
});

export const createMaterial = asyncHandler(async (req, res) => {
  if (!req.file) throw new AppError("PDF upload is required", StatusCodes.BAD_REQUEST);

  const material = await StudyMaterial.create({
    title: req.body.title,
    category: req.body.category,
    visibility: req.body.visibility,
    uploadedBy: req.user._id,
    fileUrl: `/uploads/materials/${req.file.filename}`
  });

  res.status(StatusCodes.CREATED).json({ success: true, message: "Study material uploaded", data: material });
});

export const deleteMaterial = asyncHandler(async (req, res) => {
  const material = await StudyMaterial.findById(req.params.id);
  if (!material) throw new AppError("Study material not found", StatusCodes.NOT_FOUND);
  await material.deleteOne();
  res.json({ success: true, message: "Study material deleted" });
});

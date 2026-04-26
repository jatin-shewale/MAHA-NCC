import { StatusCodes } from "http-status-codes";
import { Achievement } from "../models/Achievement.js";
import { User } from "../models/User.js";
import { createNotification } from "../services/notificationService.js";
import { AppError } from "../utils/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { paginate } from "../utils/helpers.js";

export const listAchievements = asyncHandler(async (req, res) => {
  const { page, limit, skip } = paginate(req.query);
  const query = {
    ...(req.user.role === "Cadet" ? { cadet: req.user._id } : {}),
    ...(req.query.status ? { approvalStatus: req.query.status } : {})
  };

  const [items, total] = await Promise.all([
    Achievement.find(query)
      .populate("cadet", "name cadetId rank")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Achievement.countDocuments(query)
  ]);

  res.json({ success: true, data: items, pagination: { total, page, limit, pages: Math.ceil(total / limit) } });
});

export const createAchievement = asyncHandler(async (req, res) => {
  if (!req.file) throw new AppError("Certificate upload is required", StatusCodes.BAD_REQUEST);

  const achievement = await Achievement.create({
    cadet: req.user._id,
    title: req.body.title,
    description: req.body.description,
    certificateUrl: `/uploads/certificates/${req.file.filename}`
  });

  res.status(StatusCodes.CREATED).json({ success: true, message: "Achievement submitted for review", data: achievement });
});

export const reviewAchievement = asyncHandler(async (req, res) => {
  const achievement = await Achievement.findById(req.params.id);
  if (!achievement) throw new AppError("Achievement not found", StatusCodes.NOT_FOUND);

  achievement.approvalStatus = req.body.status;
  achievement.reviewedBy = req.user._id;
  achievement.reviewedAt = new Date();
  await achievement.save();

  const cadet = await User.findById(achievement.cadet);
  if (req.body.status === "Approved" && cadet) {
    cadet.badgeScore += 25;
    cadet.achievementStreak += 1;
    cadet.badgeLevel = cadet.badgeScore >= 150 ? "Elite" : cadet.badgeScore >= 75 ? "Advanced" : "Rookie";
    await cadet.save();
  }

  await createNotification({
    title: "Achievement Review Update",
    message: `${achievement.title} has been ${req.body.status.toLowerCase()}.`,
    type: "Alert",
    recipients: [achievement.cadet]
  });

  res.json({ success: true, message: "Achievement reviewed successfully", data: achievement });
});

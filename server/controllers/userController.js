import { StatusCodes } from "http-status-codes";
import { Achievement } from "../models/Achievement.js";
import { Attendance } from "../models/Attendance.js";
import { Camp } from "../models/Camp.js";
import { User } from "../models/User.js";
import { getCadetDashboardMetrics } from "../services/analyticsService.js";
import { createNotification } from "../services/notificationService.js";
import { buildTrainingRecommendations } from "../services/recommendationService.js";
import { logAudit } from "../middlewares/auditMiddleware.js";
import { createPerformanceReport } from "../utils/pdf.js";
import { AppError } from "../utils/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { buildSearchQuery, buildSortQuery } from "../utils/apiFeatures.js";
import { REGISTRATION_STATUS, ROLES } from "../utils/constants.js";
import { paginate, pick } from "../utils/helpers.js";

export const getDashboard = asyncHandler(async (req, res) => {
  const metrics = await getCadetDashboardMetrics(req.user._id);
  const recommendations = buildTrainingRecommendations({
    attendanceRate: metrics.attendanceRate,
    approvedAchievements: metrics.approvedAchievements,
    campsJoined: metrics.campApplications,
    streak: req.user.achievementStreak
  });

  res.json({
    success: true,
    data: {
      user: req.user,
      ...metrics,
      recommendations
    }
  });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const updates = pick(req.body, ["name", "rank", "wing", "phone", "address"]);
  if (req.file) updates.profileImage = `/uploads/profiles/${req.file.filename}`;

  const user = await User.findByIdAndUpdate(req.user._id, updates, {
    new: true,
    runValidators: true
  });

  await logAudit({
    actor: req.user._id,
    action: "PROFILE_UPDATED",
    entityType: "User",
    entityId: req.user._id.toString(),
    details: updates,
    ipAddress: req.ip
  });

  res.json({ success: true, message: "Profile updated successfully", data: user });
});

export const listCadets = asyncHandler(async (req, res) => {
  const { page, limit, skip } = paginate(req.query);
  const query = {
    role: ROLES.CADET,
    ...buildSearchQuery(req.query.search, ["name", "email", "cadetId", "wing", "rank"]),
    ...(req.query.status ? { registrationStatus: req.query.status } : {})
  };

  const [items, total] = await Promise.all([
    User.find(query)
      .sort(buildSortQuery(req.query.sortBy || "createdAt", req.query.order))
      .skip(skip)
      .limit(limit),
    User.countDocuments(query)
  ]);

  res.json({
    success: true,
    data: items,
    pagination: { total, page, limit, pages: Math.ceil(total / limit) }
  });
});

export const reviewCadet = asyncHandler(async (req, res) => {
  const cadet = await User.findById(req.params.id);
  if (!cadet || cadet.role !== ROLES.CADET) throw new AppError("Cadet not found", StatusCodes.NOT_FOUND);

  cadet.registrationStatus = req.body.status;
  await cadet.save();

  await createNotification({
    title: "Registration Review Update",
    message: `Your registration has been ${req.body.status.toLowerCase()}.`,
    type: "Alert",
    recipients: [cadet._id]
  });

  res.json({ success: true, message: `Cadet ${req.body.status.toLowerCase()} successfully`, data: cadet });
});

export const updateCadet = asyncHandler(async (req, res) => {
  const cadet = await User.findById(req.params.id);
  if (!cadet || cadet.role !== ROLES.CADET) throw new AppError("Cadet not found", StatusCodes.NOT_FOUND);

  Object.assign(cadet, pick(req.body, ["name", "rank", "wing", "phone", "address", "badgeLevel", "badgeScore"]));
  await cadet.save();

  res.json({ success: true, message: "Cadet updated successfully", data: cadet });
});

export const deleteCadet = asyncHandler(async (req, res) => {
  const cadet = await User.findById(req.params.id);
  if (!cadet || cadet.role !== ROLES.CADET) throw new AppError("Cadet not found", StatusCodes.NOT_FOUND);
  await cadet.deleteOne();
  res.json({ success: true, message: "Cadet deleted successfully" });
});

export const leaderboard = asyncHandler(async (req, res) => {
  const cadets = await User.find({
    role: ROLES.CADET,
    registrationStatus: REGISTRATION_STATUS.APPROVED
  })
    .sort({ badgeScore: -1, achievementStreak: -1 })
    .select("name cadetId badgeScore badgeLevel achievementStreak profileImage")
    .limit(20);

  res.json({ success: true, data: cadets });
});

export const getDigitalId = asyncHandler(async (req, res) => {
  const data = {
    name: req.user.name,
    cadetId: req.user.cadetId,
    wing: req.user.wing,
    rank: req.user.rank,
    email: req.user.email
  };

  res.json({ success: true, data });
});

export const exportPerformanceReport = asyncHandler(async (req, res) => {
  const metrics = await getCadetDashboardMetrics(req.user._id);
  const buffer = await createPerformanceReport({
    cadet: req.user,
    stats: {
      attendanceRate: metrics.attendanceRate,
      approvedAchievements: metrics.approvedAchievements,
      campApplications: metrics.campApplications,
      leaderboardScore: req.user.badgeScore,
      badgeLevel: req.user.badgeLevel
    }
  });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename="${req.user.cadetId}-performance-report.pdf"`);
  res.send(buffer);
});

export const getCadetActivityTimeline = asyncHandler(async (req, res) => {
  const [attendance, achievements, camps] = await Promise.all([
    Attendance.find({ cadet: req.user._id }).sort({ date: -1 }).limit(6).lean(),
    Achievement.find({ cadet: req.user._id }).sort({ createdAt: -1 }).limit(6).lean(),
    Camp.find({ "applicants.cadet": req.user._id }).sort({ startDate: -1 }).limit(6).lean()
  ]);

  const timeline = [
    ...attendance.map((item) => ({ type: "attendance", title: item.status, date: item.date, meta: item.remarks })),
    ...achievements.map((item) => ({ type: "achievement", title: item.title, date: item.createdAt, meta: item.approvalStatus })),
    ...camps.map((item) => ({ type: "camp", title: item.title, date: item.startDate, meta: item.location }))
  ].sort((a, b) => new Date(b.date) - new Date(a.date));

  res.json({ success: true, data: timeline });
});

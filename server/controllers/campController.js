import { StatusCodes } from "http-status-codes";
import { Camp } from "../models/Camp.js";
import { createNotification } from "../services/notificationService.js";
import { sendEmail } from "../utils/email.js";
import { AppError } from "../utils/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { buildSearchQuery, buildSortQuery } from "../utils/apiFeatures.js";
import { paginate, pick } from "../utils/helpers.js";

export const listCamps = asyncHandler(async (req, res) => {
  const { page, limit, skip } = paginate(req.query);
  const query = {
    ...buildSearchQuery(req.query.search, ["title", "location", "description"]),
    ...(req.query.status ? { status: req.query.status } : {})
  };

  const [items, total] = await Promise.all([
    Camp.find(query)
      .populate("applicants.cadet", "name cadetId")
      .sort(buildSortQuery(req.query.sortBy || "startDate", req.query.order))
      .skip(skip)
      .limit(limit),
    Camp.countDocuments(query)
  ]);

  res.json({ success: true, data: items, pagination: { total, page, limit, pages: Math.ceil(total / limit) } });
});

export const createCamp = asyncHandler(async (req, res) => {
  const camp = await Camp.create(req.body);
  res.status(StatusCodes.CREATED).json({ success: true, message: "Camp created successfully", data: camp });
});

export const updateCamp = asyncHandler(async (req, res) => {
  const camp = await Camp.findByIdAndUpdate(req.params.id, pick(req.body, ["title", "description", "location", "startDate", "endDate", "capacity", "status"]), {
    new: true,
    runValidators: true
  });

  if (!camp) throw new AppError("Camp not found", StatusCodes.NOT_FOUND);
  res.json({ success: true, message: "Camp updated successfully", data: camp });
});

export const deleteCamp = asyncHandler(async (req, res) => {
  const camp = await Camp.findById(req.params.id);
  if (!camp) throw new AppError("Camp not found", StatusCodes.NOT_FOUND);
  await camp.deleteOne();
  res.json({ success: true, message: "Camp deleted successfully" });
});

export const applyToCamp = asyncHandler(async (req, res) => {
  const camp = await Camp.findById(req.params.id);
  if (!camp) throw new AppError("Camp not found", StatusCodes.NOT_FOUND);

  const alreadyApplied = camp.applicants.some((item) => item.cadet.toString() === req.user._id.toString());
  if (alreadyApplied) throw new AppError("Already applied to this camp", StatusCodes.BAD_REQUEST);
  if (camp.applicants.length >= camp.capacity) throw new AppError("Camp capacity reached", StatusCodes.BAD_REQUEST);

  camp.applicants.push({ cadet: req.user._id });
  await camp.save();

  await createNotification({
    title: "Camp Application Submitted",
    message: `You applied for ${camp.title}.`,
    type: "CampReminder",
    recipients: [req.user._id],
    metadata: { campId: camp._id }
  });

  res.json({ success: true, message: "Camp application submitted", data: camp });
});

export const reviewCampApplicant = asyncHandler(async (req, res) => {
  const camp = await Camp.findById(req.params.id).populate("applicants.cadet", "name email");
  if (!camp) throw new AppError("Camp not found", StatusCodes.NOT_FOUND);

  const applicant = camp.applicants.find((item) => item.cadet._id.toString() === req.params.cadetId);
  if (!applicant) throw new AppError("Applicant not found", StatusCodes.NOT_FOUND);
  applicant.status = req.body.status;
  await camp.save();

  await createNotification({
    title: "Camp Application Update",
    message: `Your application for ${camp.title} has been ${req.body.status.toLowerCase()}.`,
    type: "CampReminder",
    recipients: [req.params.cadetId]
  });

  if (applicant.cadet.email) {
    await sendEmail({
      to: applicant.cadet.email,
      subject: `Camp ${req.body.status}: ${camp.title}`,
      html: `<p>Your application for <strong>${camp.title}</strong> has been ${req.body.status.toLowerCase()}.</p>`
    });
  }

  res.json({ success: true, message: "Camp application reviewed successfully", data: camp });
});

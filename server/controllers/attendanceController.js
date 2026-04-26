import { StatusCodes } from "http-status-codes";
import QRCode from "qrcode";
import { Attendance } from "../models/Attendance.js";
import { AppError } from "../utils/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { paginate } from "../utils/helpers.js";

export const listAttendance = asyncHandler(async (req, res) => {
  const { page, limit, skip } = paginate(req.query);
  const query = {
    ...(req.user.role === "Cadet" ? { cadet: req.user._id } : {}),
    ...(req.query.cadet ? { cadet: req.query.cadet } : {})
  };

  const [items, total] = await Promise.all([
    Attendance.find(query)
      .populate("cadet", "name cadetId wing")
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit),
    Attendance.countDocuments(query)
  ]);

  res.json({ success: true, data: items, pagination: { total, page, limit, pages: Math.ceil(total / limit) } });
});

export const markAttendance = asyncHandler(async (req, res) => {
  const attendance = await Attendance.findOneAndUpdate(
    { cadet: req.body.cadet, date: req.body.date },
    { ...req.body, markedBy: req.user._id },
    { upsert: true, new: true, runValidators: true }
  );

  res.status(StatusCodes.CREATED).json({ success: true, message: "Attendance saved successfully", data: attendance });
});

export const generateQrAttendance = asyncHandler(async (req, res) => {
  const qrToken = `${req.user._id}:${Date.now()}`;
  const qrImage = await QRCode.toDataURL(qrToken);
  res.json({ success: true, data: { qrToken, qrImage } });
});

export const scanQrAttendance = asyncHandler(async (req, res) => {
  const [cadetId] = req.body.qrToken.split(":");
  if (!cadetId) throw new AppError("Invalid QR token", StatusCodes.BAD_REQUEST);

  const attendance = await Attendance.findOneAndUpdate(
    { cadet: cadetId, date: req.body.date },
    {
      cadet: cadetId,
      date: req.body.date,
      status: "Present",
      remarks: "Marked via QR scan",
      markedBy: req.user._id,
      qrToken: req.body.qrToken
    },
    { upsert: true, new: true }
  );

  res.json({ success: true, message: "QR attendance captured", data: attendance });
});

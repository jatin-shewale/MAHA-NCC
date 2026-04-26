import crypto from "crypto";
import { StatusCodes } from "http-status-codes";
import { User } from "../models/User.js";
import { createNotification } from "../services/notificationService.js";
import { REGISTRATION_STATUS, ROLES } from "../utils/constants.js";
import { AppError } from "../utils/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendEmail } from "../utils/email.js";
import { signToken } from "../utils/jwt.js";

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  cadetId: user.cadetId,
  rank: user.rank,
  wing: user.wing,
  phone: user.phone,
  address: user.address,
  profileImage: user.profileImage,
  registrationStatus: user.registrationStatus,
  badgeScore: user.badgeScore,
  badgeLevel: user.badgeLevel,
  achievementStreak: user.achievementStreak
});

const createAuthResponse = (user) => ({
  token: signToken({ id: user._id, role: user.role }),
  user: sanitizeUser(user)
});

export const register = asyncHandler(async (req, res) => {
  const existingUser = await User.findOne({ email: req.body.email });
  if (existingUser) throw new AppError("Email already in use", StatusCodes.CONFLICT);

  const adminCount = await User.countDocuments({ role: ROLES.ADMIN });
  const requestedRole = req.body.role === ROLES.ADMIN && adminCount === 0 ? ROLES.ADMIN : ROLES.CADET;

  const user = await User.create({
    ...req.body,
    role: requestedRole,
    registrationStatus: requestedRole === ROLES.ADMIN ? REGISTRATION_STATUS.APPROVED : REGISTRATION_STATUS.PENDING
  });

  await createNotification({
    title: requestedRole === ROLES.ADMIN ? "Initial Admin Bootstrapped" : "New Cadet Registration",
    message:
      requestedRole === ROLES.ADMIN
        ? `${user.name} initialized the platform as the first admin.`
        : `${user.name} has registered and awaits approval.`,
    type: "Alert",
    isBroadcast: requestedRole === ROLES.ADMIN
  });

  res.status(StatusCodes.CREATED).json({
    success: true,
    message:
      user.role === ROLES.CADET
        ? "Registration submitted. Awaiting admin approval."
        : "Initial admin account created successfully.",
    data: user.role === ROLES.ADMIN ? createAuthResponse(user) : null
  });
});

export const login = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email }).select("+password");

  if (!user || !(await user.comparePassword(req.body.password))) {
    throw new AppError("Invalid email or password", StatusCodes.UNAUTHORIZED);
  }

  if (user.role === ROLES.CADET && user.registrationStatus !== REGISTRATION_STATUS.APPROVED) {
    throw new AppError("Your cadet account is pending approval", StatusCodes.FORBIDDEN);
  }

  user.lastActiveAt = new Date();
  await user.save();

  res.json({
    success: true,
    message: "Login successful",
    data: createAuthResponse(user)
  });
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.json({ success: true, message: "If the account exists, a reset link has been sent." });
  }

  const resetToken = crypto.randomBytes(32).toString("hex");
  user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
  user.resetPasswordExpires = new Date(Date.now() + 1000 * 60 * 20);
  await user.save();

  const resetUrl = `${process.env.CLIENT_URL || "http://localhost:5173"}/reset-password/${resetToken}`;
  await sendEmail({
    to: user.email,
    subject: "Reset your NCC Pro password",
    html: `<p>Reset your password using this secure link:</p><p><a href="${resetUrl}">${resetUrl}</a></p>`
  });

  res.json({ success: true, message: "If the account exists, a reset link has been sent." });
});

export const resetPassword = asyncHandler(async (req, res) => {
  const hashedToken = crypto.createHash("sha256").update(req.params.token).digest("hex");
  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: new Date() }
  }).select("+password");

  if (!user) throw new AppError("Reset token is invalid or expired", StatusCodes.BAD_REQUEST);

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  res.json({ success: true, message: "Password reset successful" });
});

export const getMe = asyncHandler(async (req, res) => {
  res.json({ success: true, data: sanitizeUser(req.user) });
});

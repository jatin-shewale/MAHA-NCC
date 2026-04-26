import { StatusCodes } from "http-status-codes";
import { User } from "../models/User.js";
import { AppError } from "../utils/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { verifyToken } from "../utils/jwt.js";

export const protect = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

  if (!token) {
    throw new AppError("Authentication required", StatusCodes.UNAUTHORIZED);
  }

  const decoded = verifyToken(token);
  const user = await User.findById(decoded.id);

  if (!user) {
    throw new AppError("User no longer exists", StatusCodes.UNAUTHORIZED);
  }

  req.user = user;
  next();
});

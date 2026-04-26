import { StatusCodes } from "http-status-codes";
import { AppError } from "../utils/AppError.js";

export const authorize = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return next(new AppError("Access denied", StatusCodes.FORBIDDEN));
  }
  next();
};

import { StatusCodes } from "http-status-codes";
import { AppError } from "../utils/AppError.js";

export const notFound = (req, res, next) => {
  next(new AppError(`Route not found: ${req.originalUrl}`, StatusCodes.NOT_FOUND));
};

export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;

  if (err.name === "ValidationError") {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: "Validation failed",
      details: Object.values(err.errors).map((item) => item.message)
    });
  }

  if (err.code === 11000) {
    return res.status(StatusCodes.CONFLICT).json({
      success: false,
      message: "Duplicate record detected",
      details: err.keyValue
    });
  }

  if (err.name === "JsonWebTokenError") {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      message: "Invalid authentication token"
    });
  }

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal server error",
    details: err.details || null,
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack
  });
};

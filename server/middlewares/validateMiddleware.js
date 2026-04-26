import { validationResult } from "express-validator";
import { StatusCodes } from "http-status-codes";
import { AppError } from "../utils/AppError.js";

export const validate = (validations) => async (req, res, next) => {
  await Promise.all(validations.map((validation) => validation.run(req)));
  const errors = validationResult(req);

  if (errors.isEmpty()) return next();

  next(
    new AppError(
      "Validation failed",
      StatusCodes.BAD_REQUEST,
      errors.array().map((error) => ({
        field: error.path,
        message: error.msg
      }))
    )
  );
};

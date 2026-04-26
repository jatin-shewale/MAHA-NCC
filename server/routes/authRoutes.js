import { Router } from "express";
import { body } from "express-validator";
import { forgotPassword, getMe, login, register, resetPassword } from "../controllers/authController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/validateMiddleware.js";

const router = Router();

router.post(
  "/register",
  validate([
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters")
  ]),
  register
);

router.post(
  "/login",
  validate([
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").notEmpty().withMessage("Password is required")
  ]),
  login
);

router.post("/forgot-password", validate([body("email").isEmail()]), forgotPassword);
router.post("/reset-password/:token", validate([body("password").isLength({ min: 8 })]), resetPassword);
router.get("/me", protect, getMe);

export default router;

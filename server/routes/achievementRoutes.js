import { Router } from "express";
import { body } from "express-validator";
import { createAchievement, listAchievements, reviewAchievement } from "../controllers/achievementController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { authorize } from "../middlewares/roleMiddleware.js";
import { uploadCertificate } from "../middlewares/uploadMiddleware.js";
import { validate } from "../middlewares/validateMiddleware.js";

const router = Router();

router.use(protect);
router.get("/", listAchievements);
router.post(
  "/",
  authorize("Cadet"),
  uploadCertificate.single("certificate"),
  validate([body("title").notEmpty().withMessage("Title is required")]),
  createAchievement
);
router.patch("/:id/review", authorize("Admin"), validate([body("status").isIn(["Approved", "Rejected"])]), reviewAchievement);

export default router;

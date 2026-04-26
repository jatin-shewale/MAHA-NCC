import { Router } from "express";
import { body } from "express-validator";
import {
  deleteCadet,
  exportPerformanceReport,
  getCadetActivityTimeline,
  getDashboard,
  getDigitalId,
  leaderboard,
  listCadets,
  reviewCadet,
  updateCadet,
  updateProfile
} from "../controllers/userController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { authorize } from "../middlewares/roleMiddleware.js";
import { uploadProfile } from "../middlewares/uploadMiddleware.js";
import { validate } from "../middlewares/validateMiddleware.js";

const router = Router();

router.use(protect);
router.get("/dashboard", authorize("Cadet"), getDashboard);
router.put("/profile", uploadProfile.single("profileImage"), updateProfile);
router.get("/leaderboard", leaderboard);
router.get("/digital-id", authorize("Cadet"), getDigitalId);
router.get("/timeline", authorize("Cadet"), getCadetActivityTimeline);
router.get("/performance-report", authorize("Cadet"), exportPerformanceReport);
router.get("/cadets", authorize("Admin"), listCadets);
router.patch(
  "/cadets/:id/review",
  authorize("Admin"),
  validate([body("status").isIn(["Approved", "Rejected"])]),
  reviewCadet
);
router.put("/cadets/:id", authorize("Admin"), updateCadet);
router.delete("/cadets/:id", authorize("Admin"), deleteCadet);

export default router;

import { Router } from "express";
import { body } from "express-validator";
import { createAnnouncement, listNotifications, markNotificationRead } from "../controllers/notificationController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { authorize } from "../middlewares/roleMiddleware.js";
import { validate } from "../middlewares/validateMiddleware.js";

const router = Router();

router.use(protect);
router.get("/", listNotifications);
router.post(
  "/",
  authorize("Admin"),
  validate([body("title").notEmpty(), body("message").notEmpty()]),
  createAnnouncement
);
router.patch("/:id/read", markNotificationRead);

export default router;

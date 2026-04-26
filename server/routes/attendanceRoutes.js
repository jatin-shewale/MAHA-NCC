import { Router } from "express";
import { body } from "express-validator";
import {
  generateQrAttendance,
  listAttendance,
  markAttendance,
  scanQrAttendance
} from "../controllers/attendanceController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { authorize } from "../middlewares/roleMiddleware.js";
import { validate } from "../middlewares/validateMiddleware.js";

const router = Router();

router.use(protect);
router.get("/", listAttendance);
router.post(
  "/",
  authorize("Admin"),
  validate([body("cadet").notEmpty(), body("date").isISO8601(), body("status").isIn(["Present", "Absent", "Late", "Excused"])]),
  markAttendance
);
router.get("/qr", authorize("Cadet"), generateQrAttendance);
router.post("/scan", authorize("Admin"), validate([body("qrToken").notEmpty(), body("date").isISO8601()]), scanQrAttendance);

export default router;

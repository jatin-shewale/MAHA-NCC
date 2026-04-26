import { Router } from "express";
import { body } from "express-validator";
import {
  applyToCamp,
  createCamp,
  deleteCamp,
  listCamps,
  reviewCampApplicant,
  updateCamp
} from "../controllers/campController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { authorize } from "../middlewares/roleMiddleware.js";
import { validate } from "../middlewares/validateMiddleware.js";

const router = Router();

router.use(protect);
router.get("/", listCamps);
router.post(
  "/",
  authorize("Admin"),
  validate([
    body("title").notEmpty(),
    body("description").notEmpty(),
    body("location").notEmpty(),
    body("startDate").isISO8601(),
    body("endDate").isISO8601(),
    body("capacity").isInt({ min: 1 })
  ]),
  createCamp
);
router.put("/:id", authorize("Admin"), updateCamp);
router.delete("/:id", authorize("Admin"), deleteCamp);
router.post("/:id/apply", authorize("Cadet"), applyToCamp);
router.patch(
  "/:id/applicants/:cadetId",
  authorize("Admin"),
  validate([body("status").isIn(["Approved", "Rejected"])]),
  reviewCampApplicant
);

export default router;

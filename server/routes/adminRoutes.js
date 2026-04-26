import { Router } from "express";
import { getAdminDashboard } from "../controllers/adminController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { authorize } from "../middlewares/roleMiddleware.js";

const router = Router();

router.use(protect, authorize("Admin"));
router.get("/dashboard", getAdminDashboard);

export default router;

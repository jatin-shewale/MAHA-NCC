import { Router } from "express";
import adminRoutes from "./adminRoutes.js";
import achievementRoutes from "./achievementRoutes.js";
import attendanceRoutes from "./attendanceRoutes.js";
import authRoutes from "./authRoutes.js";
import campRoutes from "./campRoutes.js";
import materialRoutes from "./materialRoutes.js";
import notificationRoutes from "./notificationRoutes.js";
import userRoutes from "./userRoutes.js";

export const apiRouter = Router();

apiRouter.use("/auth", authRoutes);
apiRouter.use("/admin", adminRoutes);
apiRouter.use("/users", userRoutes);
apiRouter.use("/camps", campRoutes);
apiRouter.use("/attendance", attendanceRoutes);
apiRouter.use("/achievements", achievementRoutes);
apiRouter.use("/materials", materialRoutes);
apiRouter.use("/notifications", notificationRoutes);

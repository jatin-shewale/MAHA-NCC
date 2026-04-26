import { AuditLog } from "../models/AuditLog.js";
import { getAdminDashboardMetrics } from "../services/analyticsService.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getAdminDashboard = asyncHandler(async (req, res) => {
  const metrics = await getAdminDashboardMetrics();
  const auditLogs = await AuditLog.find().populate("actor", "name role").sort({ createdAt: -1 }).limit(10);

  res.json({
    success: true,
    data: {
      ...metrics,
      auditLogs
    }
  });
});

import { AuditLog } from "../models/AuditLog.js";

export const logAudit = async ({ actor, action, entityType, entityId, details, ipAddress }) => {
  await AuditLog.create({
    actor,
    action,
    entityType,
    entityId,
    details,
    ipAddress
  });
};

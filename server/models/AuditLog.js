import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema(
  {
    actor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    action: {
      type: String,
      required: true
    },
    entityType: {
      type: String,
      required: true
    },
    entityId: String,
    details: mongoose.Schema.Types.Mixed,
    ipAddress: String
  },
  { timestamps: true }
);

auditLogSchema.index({ actor: 1, createdAt: -1 });
auditLogSchema.index({ entityType: 1, entityId: 1 });

export const AuditLog = mongoose.model("AuditLog", auditLogSchema);

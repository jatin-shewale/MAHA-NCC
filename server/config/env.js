import dotenv from "dotenv";

dotenv.config();

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 5000),
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
  mongoUri: process.env.MONGO_URI || "mongodb://127.0.0.1:27017/ncc-cadet-management-pro",
  jwtSecret: process.env.JWT_SECRET || "change_this_super_secret_key",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  emailHost: process.env.EMAIL_HOST || "",
  emailPort: Number(process.env.EMAIL_PORT || 587),
  emailSecure: process.env.EMAIL_SECURE === "true",
  emailUser: process.env.EMAIL_USER || "",
  emailPass: process.env.EMAIL_PASS || "",
  emailFrom: process.env.EMAIL_FROM || "NCC Cadet Management System Pro <no-reply@ncc-pro.com>"
};

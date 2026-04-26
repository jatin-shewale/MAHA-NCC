import fs from "fs";
import path from "path";
import multer from "multer";
import { fileURLToPath } from "url";
import { AppError } from "../utils/AppError.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsRoot = path.join(__dirname, "..", "uploads");

for (const folder of ["profiles", "certificates", "materials"]) {
  fs.mkdirSync(path.join(uploadsRoot, folder), { recursive: true });
}

const createStorage = (folder) =>
  multer.diskStorage({
    destination: (req, file, cb) => cb(null, path.join(uploadsRoot, folder)),
    filename: (req, file, cb) => {
      const safeName = `${Date.now()}-${file.originalname.replace(/\s+/g, "-")}`;
      cb(null, safeName);
    }
  });

const fileFilter = (allowedTypes) => (req, file, cb) => {
  if (allowedTypes.includes(file.mimetype)) return cb(null, true);
  cb(new AppError("Unsupported file type", 400));
};

export const uploadProfile = multer({
  storage: createStorage("profiles"),
  limits: { fileSize: 3 * 1024 * 1024 },
  fileFilter: fileFilter(["image/jpeg", "image/png", "image/webp"])
});

export const uploadCertificate = multer({
  storage: createStorage("certificates"),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: fileFilter(["application/pdf", "image/jpeg", "image/png"])
});

export const uploadMaterial = multer({
  storage: createStorage("materials"),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: fileFilter(["application/pdf"])
});

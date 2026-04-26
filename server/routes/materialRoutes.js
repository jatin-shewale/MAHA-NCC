import { Router } from "express";
import { body } from "express-validator";
import { createMaterial, deleteMaterial, listMaterials } from "../controllers/materialController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { authorize } from "../middlewares/roleMiddleware.js";
import { uploadMaterial } from "../middlewares/uploadMiddleware.js";
import { validate } from "../middlewares/validateMiddleware.js";

const router = Router();

router.use(protect);
router.get("/", listMaterials);
router.post(
  "/",
  authorize("Admin"),
  uploadMaterial.single("file"),
  validate([body("title").notEmpty(), body("category").notEmpty()]),
  createMaterial
);
router.delete("/:id", authorize("Admin"), deleteMaterial);

export default router;

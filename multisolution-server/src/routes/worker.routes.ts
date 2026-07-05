import express from "express";
import {
  createWorkerProfile,
  getWorkers,
  getWorkerById,
  getMyWorkerProfile,
  updateMyWorkerProfile,
  verifyWorker,
} from "../controllers/worker.controller";
import { protect } from "../middleware/auth.middleware";
import { requireAdmin } from "../middleware/admin.middleware";

const router = express.Router();

router.get("/", getWorkers);
router.get("/me/profile", protect, getMyWorkerProfile);
router.patch("/me/profile", protect, updateMyWorkerProfile);
router.post("/", protect, createWorkerProfile);
router.get("/:id", getWorkerById);
router.patch("/:id/verify", protect, requireAdmin, verifyWorker);

export default router;

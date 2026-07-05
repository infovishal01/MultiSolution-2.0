import express from "express";
import {
  createBooking,
  getBookings,
  getMyBookings,
  getBookingById,
  updateBookingStatus,
  cancelBooking,
} from "../controllers/booking.controller";
import { protect } from "../middleware/auth.middleware";
import { requireAdmin } from "../middleware/admin.middleware";

const router = express.Router();

router.post("/", createBooking);
router.get("/mine", protect, getMyBookings);
router.get("/", protect, requireAdmin, getBookings);
router.get("/:id", protect, getBookingById);
router.patch("/:id/status", protect, requireAdmin, updateBookingStatus);
router.delete("/:id", protect, cancelBooking);

export default router;

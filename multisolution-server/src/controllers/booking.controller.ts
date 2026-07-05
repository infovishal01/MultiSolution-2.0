import { Request, Response } from "express";
import Booking from "../models/Booking";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";

// POST /api/bookings  (public: guests can book too, logged-in users get it linked to their account)
export const createBooking = asyncHandler(async (req: Request, res: Response) => {
  const { fullName, phone, service, address } = req.body;

  if (!fullName || !phone || !service || !address) {
    throw new ApiError(400, "fullName, phone, service and address are required");
  }

  const booking = await Booking.create({
    ...req.body,
    customer: req.user?._id,
  });

  res.status(201).json({ success: true, booking });
});

// GET /api/bookings  (admin only: list all bookings, optional ?status= filter)
export const getBookings = asyncHandler(async (req: Request, res: Response) => {
  const { status } = req.query;
  const filter: Record<string, unknown> = {};
  if (status) filter.status = status;

  const bookings = await Booking.find(filter)
    .populate("customer", "name email phone")
    .populate({ path: "worker", populate: { path: "user", select: "name phone" } })
    .sort({ createdAt: -1 });

  res.status(200).json({ success: true, count: bookings.length, bookings });
});

// GET /api/bookings/mine  (logged-in customer's own bookings)
export const getMyBookings = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw new ApiError(401, "Not authorized");

  const bookings = await Booking.find({ customer: req.user._id }).sort({ createdAt: -1 });
  res.status(200).json({ success: true, count: bookings.length, bookings });
});

// GET /api/bookings/:id
export const getBookingById = asyncHandler(async (req: Request, res: Response) => {
  const booking = await Booking.findById(req.params.id)
    .populate("customer", "name email phone")
    .populate({ path: "worker", populate: { path: "user", select: "name phone" } });

  if (!booking) throw new ApiError(404, "Booking not found");
  res.status(200).json({ success: true, booking });
});

// PATCH /api/bookings/:id/status  (admin only)
export const updateBookingStatus = asyncHandler(async (req: Request, res: Response) => {
  const { status, worker } = req.body;
  const allowed = ["Pending", "Assigned", "Completed", "Cancelled"];

  if (status && !allowed.includes(status)) {
    throw new ApiError(400, `status must be one of: ${allowed.join(", ")}`);
  }

  const update: Record<string, unknown> = {};
  if (status) update.status = status;
  if (worker) update.worker = worker;

  const booking = await Booking.findByIdAndUpdate(req.params.id, update, { new: true });
  if (!booking) throw new ApiError(404, "Booking not found");

  res.status(200).json({ success: true, booking });
});

// DELETE /api/bookings/:id  (admin only, or the customer who owns a still-pending booking)
export const cancelBooking = asyncHandler(async (req: Request, res: Response) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) throw new ApiError(404, "Booking not found");

  const isOwner = req.user && booking.customer?.toString() === req.user._id.toString();
  const isAdmin = req.user?.role === "admin";

  if (!isOwner && !isAdmin) {
    throw new ApiError(403, "You cannot cancel this booking");
  }

  booking.status = "Cancelled";
  await booking.save();

  res.status(200).json({ success: true, booking });
});

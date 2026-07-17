import { Request, Response } from "express";
import Booking from "../models/Booking";
import Worker from "../models/Worker";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import logger from "../utils/logger";

// POST /api/bookings  (public: guests can book too, logged-in users get it linked to their account)
export const createBooking = asyncHandler(async (req: Request, res: Response) => {
  const { fullName, phone, service, address, email, preferredDate, preferredTime, notes } = req.body;

  // Validate required fields
  if (!fullName || !phone || !service || !address) {
    throw new ApiError(400, "fullName, phone, service and address are required");
  }

  // Validate phone number format (basic check)
  if (!phone || phone.length < 10) {
    throw new ApiError(400, "Please provide a valid phone number (minimum 10 digits)");
  }

  // Validate service exists
  const validServices = ["Electrician", "Plumber", "Home Cleaning", "AC Repair", "Carpenter", "Painting", "Salon at Home", "Appliance Repair"];
  if (!validServices.includes(service)) {
    throw new ApiError(400, `Invalid service. Must be one of: ${validServices.join(", ")}`);
  }

  // Check if worker is available for this service (optional validation)
  const availableWorkers = await Worker.countDocuments({
    services: service,
    isAvailable: true,
    isVerified: true,
  });
  
  if (availableWorkers === 0) {
    logger.warn(`No available workers for service: ${service}`);
    // Don't block the booking, but log it
  }

  const booking = await Booking.create({
    fullName,
    phone,
    email: email || req.user?.email,
    service,
    address,
    preferredDate: preferredDate ? new Date(preferredDate) : undefined,
    preferredTime,
    notes,
    customer: req.user?._id,
  });

  logger.info(`New booking created: ${booking._id} for service: ${service}`);

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

  const bookings = await Booking.find({ customer: req.user._id })
    .populate("customer", "name email phone")
    .populate({ path: "worker", populate: { path: "user", select: "name phone" } })
    .sort({ createdAt: -1 });
  
  res.status(200).json({ success: true, count: bookings.length, bookings });
});

// GET /api/bookings/:id
export const getBookingById = asyncHandler(async (req: Request, res: Response) => {
  // Check if the booking belongs to the user or user is admin
  const booking = await Booking.findById(req.params.id)
    .populate("customer", "name email phone")
    .populate({ path: "worker", populate: { path: "user", select: "name phone" } });

  if (!booking) throw new ApiError(404, "Booking not found");
  
  // Check authorization - only admin or owner can view
  if (req.user) {
    const isOwner = booking.customer?.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";
    if (!isOwner && !isAdmin) {
      throw new ApiError(403, "You don't have access to this booking");
    }
  }
  
  res.status(200).json({ success: true, booking });
});

// PATCH /api/bookings/:id/status  (admin only)
export const updateBookingStatus = asyncHandler(async (req: Request, res: Response) => {
  const { status, worker: workerId } = req.body;
  const allowed = ["Pending", "Assigned", "Completed", "Cancelled"];

  if (status && !allowed.includes(status)) {
    throw new ApiError(400, `status must be one of: ${allowed.join(", ")}`);
  }

  // Validate worker exists if assigning
  if (workerId) {
    const workerExists = await Worker.findById(workerId);
    if (!workerExists) {
      throw new ApiError(404, "Worker not found");
    }
  }

  const update: Record<string, unknown> = {};
  if (status) update.status = status;
  if (workerId) update.worker = workerId;

  const booking = await Booking.findByIdAndUpdate(req.params.id, update, { new: true });
  if (!booking) throw new ApiError(404, "Booking not found");

  logger.info(`Booking ${req.params.id} status updated to ${status} by admin`);

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

  // Only allow cancellation if status is Pending or Assigned
  if (booking.status === "Completed" || booking.status === "Cancelled") {
    throw new ApiError(400, `Cannot cancel a ${booking.status.toLowerCase()} booking`);
  }

  booking.status = "Cancelled";
  await booking.save();

  logger.info(`Booking ${booking._id} cancelled by ${isAdmin ? "admin" : "customer"}`);

  res.status(200).json({ success: true, booking });
});

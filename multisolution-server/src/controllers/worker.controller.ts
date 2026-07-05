import { Request, Response } from "express";
import Worker from "../models/Worker";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";

// POST /api/workers  (worker completes their profile)
export const createWorkerProfile = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw new ApiError(401, "Not authorized");

  const existing = await Worker.findOne({ user: req.user._id });
  if (existing) {
    throw new ApiError(409, "Worker profile already exists for this account");
  }

  const { services, experienceYears, bio, city } = req.body;

  if (!services || !Array.isArray(services) || services.length === 0 || !city) {
    throw new ApiError(400, "services (at least one) and city are required");
  }

  const worker = await Worker.create({
    user: req.user._id,
    services,
    experienceYears,
    bio,
    city,
  });

  res.status(201).json({ success: true, worker });
});

// GET /api/workers?service=Electrician&city=Patna
export const getWorkers = asyncHandler(async (req: Request, res: Response) => {
  const { service, city } = req.query;

  const filter: Record<string, unknown> = { isAvailable: true };
  if (service) filter.services = service;
  if (city) filter.city = new RegExp(`^${String(city)}$`, "i");

  const workers = await Worker.find(filter)
    .populate("user", "name email phone")
    .sort({ rating: -1 });

  res.status(200).json({ success: true, count: workers.length, workers });
});

// GET /api/workers/:id
export const getWorkerById = asyncHandler(async (req: Request, res: Response) => {
  const worker = await Worker.findById(req.params.id).populate("user", "name email phone");
  if (!worker) throw new ApiError(404, "Worker not found");
  res.status(200).json({ success: true, worker });
});

// GET /api/workers/me/profile  (logged-in worker's own profile)
export const getMyWorkerProfile = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw new ApiError(401, "Not authorized");

  const worker = await Worker.findOne({ user: req.user._id });
  if (!worker) throw new ApiError(404, "You don't have a worker profile yet");

  res.status(200).json({ success: true, worker });
});

// PATCH /api/workers/me/profile
export const updateMyWorkerProfile = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw new ApiError(401, "Not authorized");

  const worker = await Worker.findOne({ user: req.user._id });
  if (!worker) throw new ApiError(404, "You don't have a worker profile yet");

  const { services, experienceYears, bio, city, isAvailable } = req.body;

  if (services !== undefined) worker.services = services;
  if (experienceYears !== undefined) worker.experienceYears = experienceYears;
  if (bio !== undefined) worker.bio = bio;
  if (city !== undefined) worker.city = city;
  if (isAvailable !== undefined) worker.isAvailable = isAvailable;

  await worker.save();

  res.status(200).json({ success: true, worker });
});

// PATCH /api/workers/:id/verify  (admin only)
export const verifyWorker = asyncHandler(async (req: Request, res: Response) => {
  const worker = await Worker.findByIdAndUpdate(
    req.params.id,
    { isVerified: true },
    { new: true }
  );
  if (!worker) throw new ApiError(404, "Worker not found");
  res.status(200).json({ success: true, worker });
});

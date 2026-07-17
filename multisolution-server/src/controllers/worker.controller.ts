import { Request, Response } from "express";
import Worker from "../models/Worker";
import User from "../models/user";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import logger from "../utils/logger";
import { SERVICE_CATEGORIES } from "../constants/services";

// POST /api/workers  (worker completes their profile)
export const createWorkerProfile = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw new ApiError(401, "Not authorized");

  // Check if user is a worker
  if (req.user.role !== "worker") {
    throw new ApiError(403, "Only users with worker role can create a worker profile");
  }

  const existing = await Worker.findOne({ user: req.user._id });
  if (existing) {
    throw new ApiError(409, "Worker profile already exists for this account");
  }

  const { services, experienceYears, bio, city } = req.body;

  // Validate services
  if (!services || !Array.isArray(services) || services.length === 0) {
    throw new ApiError(400, "services (at least one) are required");
  }

  // Validate all services are valid
  const invalidServices = services.filter(
    (s: string) => !SERVICE_CATEGORIES.includes(s as any)
  );
  if (invalidServices.length > 0) {
    throw new ApiError(
      400,
      `Invalid services: ${invalidServices.join(", ")}. Valid services are: ${SERVICE_CATEGORIES.join(", ")}`
    );
  }

  // Validate city
  if (!city || typeof city !== "string" || city.trim().length === 0) {
    throw new ApiError(400, "city is required and must be a valid string");
  }

  // Validate experienceYears
  if (experienceYears !== undefined && (experienceYears < 0 || experienceYears > 50)) {
    throw new ApiError(400, "experienceYears must be between 0 and 50");
  }

  // Validate bio length
  if (bio && bio.length > 500) {
    throw new ApiError(400, "bio must be less than 500 characters");
  }

  const worker = await Worker.create({
    user: req.user._id,
    services,
    experienceYears: experienceYears || 0,
    bio: bio || "",
    city: city.trim(),
  });

  // Update user to link to worker profile
  await User.findByIdAndUpdate(req.user._id, { workerProfile: worker._id });

  logger.info(`Worker profile created for user: ${req.user._id}`);

  res.status(201).json({ success: true, worker });
});

// GET /api/workers?service=Electrician&city=Patna&verified=true
export const getWorkers = asyncHandler(async (req: Request, res: Response) => {
  const { service, city, verified, available } = req.query;

  const filter: Record<string, unknown> = {};
  
  // Filter by availability (default to true)
  filter.isAvailable = available !== "false"; // if available=false, show unavailable
  
  // Filter by verified status
  if (verified === "true") {
    filter.isVerified = true;
  } else if (verified === "false") {
    filter.isVerified = false;
  }

  // Filter by service
  if (service && typeof service === "string") {
    // Check if it's a valid service
    if (SERVICE_CATEGORIES.includes(service as any)) {
      filter.services = service;
    } else {
      // If invalid service, return empty result
      return res.status(200).json({ success: true, count: 0, workers: [] });
    }
  }

  // Filter by city (case-insensitive exact match)
  if (city && typeof city === "string") {
    filter.city = new RegExp(`^${city.trim()}$`, "i");
  }

  const workers = await Worker.find(filter)
    .populate("user", "name email phone role")
    .sort({ rating: -1, createdAt: -1 });

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

  // Validate services if provided
  if (services !== undefined) {
    if (!Array.isArray(services) || services.length === 0) {
      throw new ApiError(400, "services must be an array with at least one service");
    }
    const invalidServices = services.filter(
      (s: string) => !SERVICE_CATEGORIES.includes(s as any)
    );
    if (invalidServices.length > 0) {
      throw new ApiError(
        400,
        `Invalid services: ${invalidServices.join(", ")}. Valid services are: ${SERVICE_CATEGORIES.join(", ")}`
      );
    }
    worker.services = services;
  }

  // Validate experienceYears if provided
  if (experienceYears !== undefined) {
    if (experienceYears < 0 || experienceYears > 50) {
      throw new ApiError(400, "experienceYears must be between 0 and 50");
    }
    worker.experienceYears = experienceYears;
  }

  // Validate bio if provided
  if (bio !== undefined) {
    if (bio.length > 500) {
      throw new ApiError(400, "bio must be less than 500 characters");
    }
    worker.bio = bio;
  }

  // Validate city if provided
  if (city !== undefined) {
    if (typeof city !== "string" || city.trim().length === 0) {
      throw new ApiError(400, "city must be a valid string");
    }
    worker.city = city.trim();
  }

  // Update availability
  if (isAvailable !== undefined) {
    worker.isAvailable = Boolean(isAvailable);
  }

  await worker.save();

  logger.info(`Worker profile updated for user: ${req.user._id}`);

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
  
  logger.info(`Worker ${worker._id} verified by admin`);
  
  res.status(200).json({ success: true, worker });
});

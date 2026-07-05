import { Request, Response } from "express";
import User, { IUser } from "../models/user";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import { generateToken, setTokenCookie, clearTokenCookie } from "../utils/generateToken";

const sanitizeUser = (user: IUser) => ({
  id: user._id?.toString(),
  name: user.name,
  email: user.email,
  phone: user.phone,
  role: user.role,
});

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password, phone, role } = req.body;

  if (!name || !email || !password || !phone) {
    throw new ApiError(400, "Name, email, phone and password are required");
  }

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    throw new ApiError(409, "An account with this email already exists");
  }

  // Only allow "customer" or "worker" at signup; "admin" must be set manually.
  const safeRole = role === "worker" ? "worker" : "customer";

  const user = await User.create({ name, email, password, phone, role: safeRole });

  const token = generateToken(user.id);
  setTokenCookie(res, token);

  res.status(201).json({
    success: true,
    user: sanitizeUser(user),
    token,
  });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, "Invalid email or password");
  }

  const token = generateToken(user.id);
  setTokenCookie(res, token);

  res.status(200).json({
    success: true,
    user: sanitizeUser(user),
    token,
  });
});

export const logout = asyncHandler(async (_req: Request, res: Response) => {
  clearTokenCookie(res);
  res.status(200).json({ success: true, message: "Logged out successfully" });
});

export const getMe = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, "Not authorized");
  }
  res.status(200).json({ success: true, user: sanitizeUser(req.user) });
});

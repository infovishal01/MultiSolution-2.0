import { Request, Response } from "express";
import User, { IUser } from "../models/user";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import { generateToken, setTokenCookie, clearTokenCookie } from "../utils/generateToken";
import logger from "../utils/logger";

const sanitizeUser = (user: IUser) => ({
  id: user._id?.toString(),
  name: user.name,
  email: user.email,
  phone: user.phone,
  role: user.role,
  createdAt: user.createdAt,
});

// Email validation regex
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password strength validation
const isValidPassword = (password: string): boolean => {
  return password.length >= 6;
};

// Phone validation
const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^\d{10,15}$/;
  return phoneRegex.test(phone);
};

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password, phone, role } = req.body;

  // Validate required fields
  if (!name || !email || !password || !phone) {
    throw new ApiError(400, "Name, email, phone and password are required");
  }

  // Validate email format
  if (!isValidEmail(email)) {
    throw new ApiError(400, "Please provide a valid email address");
  }

  // Validate password strength
  if (!isValidPassword(password)) {
    throw new ApiError(400, "Password must be at least 6 characters long");
  }

  // Validate phone format
  if (!isValidPhone(phone)) {
    throw new ApiError(400, "Phone must be 10-15 digits");
  }

  // Check if email already exists
  const existingEmail = await User.findOne({ email: email.toLowerCase() });
  if (existingEmail) {
    throw new ApiError(409, "An account with this email already exists");
  }

  // Check if phone already exists
  const existingPhone = await User.findOne({ phone });
  if (existingPhone) {
    throw new ApiError(409, "An account with this phone number already exists");
  }

  // Only allow "customer" or "worker" at signup; "admin" must be set manually.
  const safeRole = role === "worker" ? "worker" : "customer";

  // Sanitize inputs
  const sanitizedName = name.trim();
  const sanitizedEmail = email.toLowerCase().trim();
  const sanitizedPhone = phone.trim();

  const user = await User.create({
    name: sanitizedName,
    email: sanitizedEmail,
    password,
    phone: sanitizedPhone,
    role: safeRole,
  });

  const token = generateToken(user.id);
  setTokenCookie(res, token);

  logger.info(`New user registered: ${user._id} with role: ${user.role}`);

  res.status(201).json({
    success: true,
    message: "Registration successful",
    user: sanitizeUser(user),
    token,
  });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  // Validate email format
  if (!isValidEmail(email)) {
    throw new ApiError(400, "Please provide a valid email address");
  }

  const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
  if (!user) {
    // Generic error message for security
    throw new ApiError(401, "Invalid email or password");
  }

  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid email or password");
  }

  const token = generateToken(user.id);
  setTokenCookie(res, token);

  logger.info(`User logged in: ${user._id}`);

  res.status(200).json({
    success: true,
    message: "Login successful",
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

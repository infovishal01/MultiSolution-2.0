import jwt from "jsonwebtoken";
import { Response } from "express";
import { Types } from "mongoose";

const COOKIE_NAME = "token";

export const generateToken = (userId: Types.ObjectId | string): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  return jwt.sign({ id: userId.toString() }, secret, {
    expiresIn: "30d",
  });
};

export const setTokenCookie = (res: Response, token: string): void => {
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });
};

export const clearTokenCookie = (res: Response): void => {
  res.clearCookie(COOKIE_NAME);
};

export { COOKIE_NAME };

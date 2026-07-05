import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import { COOKIE_NAME } from "../utils/generateToken";

interface DecodedToken {
  id: string;
}

export const protect = asyncHandler(
  async (req: Request, _res: Response, next: NextFunction) => {
    const bearer = req.headers.authorization;
    const token =
      req.cookies?.[COOKIE_NAME] ||
      (bearer?.startsWith("Bearer ") ? bearer.split(" ")[1] : undefined);

    if (!token) {
      throw new ApiError(401, "Not authorized, please log in");
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new ApiError(500, "Server misconfiguration: missing JWT secret");
    }

    let decoded: DecodedToken;
    try {
      decoded = jwt.verify(token, secret) as DecodedToken;
    } catch {
      throw new ApiError(401, "Session expired, please log in again");
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      throw new ApiError(401, "User no longer exists");
    }

    req.user = user;
    next();
  }
);

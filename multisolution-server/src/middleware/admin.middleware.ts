import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";

export const requireAdmin = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  if (!req.user || req.user.role !== "admin") {
    return next(new ApiError(403, "Admin access required"));
  }
  next();
};

/** Generic role guard, e.g. requireRole("worker", "admin") */
export const requireRole =
  (...roles: string[]) =>
  (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new ApiError(403, "You don't have access to this resource"));
    }
    next();
  };

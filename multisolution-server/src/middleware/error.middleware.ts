import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";
import logger from "../utils/logger";
import mongoose from "mongoose";

export const notFound = (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
};

export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
) => {
  // Log the error
  logger.error("Error:", err);

  let statusCode = 500;
  let message = "Internal server error";

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
  }
  // Mongoose duplicate key error
  else if (err instanceof Error && (err as any).code === 11000) {
    statusCode = 409;
    const key = Object.keys((err as any).keyPattern || {})[0];
    const value = (err as any).keyValue?.[key];
    message = `Duplicate key error: ${key} '${value}' already exists`;
  }
  // Mongoose validation error
  else if (err instanceof mongoose.Error.ValidationError) {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((val: any) => val.message)
      .join(", ");
  }
  // Mongoose CastError (invalid ID format)
  else if (err instanceof mongoose.Error.CastError) {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }
  // JWT errors
  else if (err instanceof Error && err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token, please log in again";
  }
  else if (err instanceof Error && err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token expired, please log in again";
  }
  else if (err instanceof Error) {
    statusCode = err.name === "NotFoundError" ? 404 : 500;
    message = err.message;
  }

  // In production, send generic message for 5xx errors
  if (process.env.NODE_ENV === "production" && statusCode >= 500) {
    message = "Something went wrong on the server";
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV !== "production" && { error: err }),
  });
};

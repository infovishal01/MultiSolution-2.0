import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import connectDB from "./config/db";
import logger from "./utils/logger";
import { Server } from "http";

const PORT = process.env.PORT || 5000;

let server: Server;

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  logger.error("UNCAUGHT EXCEPTION:", err);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  logger.error("UNHANDLED REJECTION:", err);
  // Close server gracefully
  if (server) {
    server.close(() => process.exit(1));
  } else {
    process.exit(1);
  }
});

// Graceful shutdown
process.on("SIGTERM", () => {
  logger.info("SIGTERM received. Shutting down gracefully...");
  if (server) {
    server.close(() => {
      logger.info("Server closed");
      process.exit(0);
    });
  }
});

const start = async () => {
  try {
    await connectDB();
    
    server = app.listen(PORT, () => {
      logger.info(`Server running in ${process.env.NODE_ENV || "development"} mode`);
      logger.info(`Server running on http://localhost:${PORT}`);
      logger.info(`MongoDB connected`);
    });
    
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
};

start();

export {};

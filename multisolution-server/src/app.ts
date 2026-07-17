import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const xss = require("xss-clean");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const hpp = require("hpp");
import authRoutes from "./routes/auth.routes";
import bookingRoutes from "./routes/booking.routes";
import workerRoutes from "./routes/worker.routes";
import { notFound, errorHandler } from "./middleware/error.middleware";
import logger from "./utils/logger";

const app = express();

// 1. Security Middleware
app.use(helmet());

// Rate limiting - 100 requests per 15 minutes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { success: false, message: "Too many requests, please try again later" },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api/", limiter);

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(hpp());

// 2. CORS Configuration
const corsOrigins = process.env.CLIENT_URL?.split(",") || "http://localhost:5173";
const corsOptions: cors.CorsOptions = {
  origin: Array.isArray(corsOrigins) ? corsOrigins : corsOrigins,
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

// 3. Body parsing
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

// 4. Request logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  next();
});

// 5. Health Check
app.get("/api/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "MultiSolution API is running",
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || "development",
  });
});

// 6. API Routes
app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/workers", workerRoutes);

// 7. Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

export default app;

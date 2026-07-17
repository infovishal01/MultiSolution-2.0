import winston from "winston";
import { Writable } from "stream";

// Create a writable stream for morgan
class MorganStream extends Writable {
  private logger: winston.Logger;

  constructor(logger: winston.Logger) {
    super();
    this.logger = logger;
  }

  _write(chunk: any, _encoding: string, callback: (error?: Error | null) => void): void {
    this.logger.info(chunk.toString().trim());
    callback();
  }
}

const logger = winston.createLogger({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  defaultMeta: { service: "multisolution-server" },
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
    new winston.transports.File({ filename: "logs/error.log", level: "error" }),
    new winston.transports.File({ filename: "logs/combined.log" }),
  ],
});

// Create stream for morgan
const morganStream = new MorganStream(logger);

// Export both logger and stream
export { morganStream };
export default logger;

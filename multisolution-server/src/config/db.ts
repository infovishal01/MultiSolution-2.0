import mongoose from "mongoose";
import logger from "../utils/logger";

const connectDB = async (): Promise<void> => {
  const uri = process.env.MONGO_URI || 
    "mongodb+srv://infovishalkumar01_db_user:FACNXr7epX4ZqPsu@cluster0.n1no7sj.mongodb.net/";

  if (!uri) {
    logger.error("MONGO_URI is not defined. Add it to multisolution-server/.env");
    process.exit(1);
  }

  try {
    // Connection options for production
    const options: mongoose.ConnectOptions = {
      maxPoolSize: 10,
      socketTimeoutMS: 30000,
      serverSelectionTimeoutMS: 5000,
      retryWrites: true,
      w: "majority",
    };

    logger.info("Connecting to MongoDB...");
    await mongoose.connect(uri, options);
    logger.info("MongoDB connected successfully");
    
    // Connection events
    mongoose.connection.on("error", (err) => {
      logger.error("MongoDB connection error:", err);
    });
    
    mongoose.connection.on("disconnected", () => {
      logger.warn("MongoDB disconnected");
    });
    
    // Graceful shutdown
    process.on("SIGINT", async () => {
      await mongoose.connection.close();
      logger.info("MongoDB connection closed on app termination");
      process.exit(0);
    });
    
  } catch (error) {
    logger.error("MongoDB connection failed:", error);
    process.exit(1);
  }
};

export default connectDB;

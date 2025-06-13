import mongoose from "mongoose";
import { logger, loadConfig } from "./index";

const config = loadConfig();

/**
 * Initializes and connects to MongoDB.
 */
async function connectToDatabase(): Promise<void> {
  if (!config.BACKEND_MONGODB_URI) {
    logger.error("MongoDB URI is not defined in environment variables.");
    return;
  }

  mongoose.Promise = Promise;

  try {
    await mongoose.connect(config.BACKEND_MONGODB_URI);
    logger.info("MongoDB connected");
  } catch (error) {
    logger.error("MongoDB connection error:", error);
  }

  mongoose.connection.on("error", (err: Error) => {
    logger.error("MongoDB connection error:", err);
  });
}

/**
 * Gracefully disconnect from MongoDB.
 */
async function disconnectFromDatabase(): Promise<void> {
  await mongoose.disconnect();
  logger.info("MongoDB disconnected");
}

export { connectToDatabase, disconnectFromDatabase };

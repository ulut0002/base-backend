import mongoose from "mongoose";
import { logger, loadConfig } from "./index";

/**
 * Initializes and connects to MongoDB.
 */
async function connectToDatabase(): Promise<void> {
  const config = loadConfig();

  if (!config.backendMongoDbUri) {
    logger.error("MongoDB URI is not defined in environment variables.");
    return;
  }

  mongoose.Promise = Promise;

  try {
    await mongoose.connect(config.backendMongoDbUri);
  } catch (error) {}

  mongoose.connection.on("error", (err: Error) => {});
}

/**
 * Gracefully disconnect from MongoDB.
 */
async function disconnectFromDatabase(): Promise<void> {
  await mongoose.disconnect();
  logger.info("MongoDB disconnected");
}

export { connectToDatabase, disconnectFromDatabase };

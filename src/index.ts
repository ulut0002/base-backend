import express, { Request, Response } from "express";
import dotenv from "dotenv";
import passport from "passport";

import "./jobs/scheduler"; // Background job scheduler

import {
  adminRouter,
  authRouter,
  meRouter,
  recoveryRouter,
  rootRouter,
  securityRouter,
  swaggerRoute,
  // swaggerRoute,
} from "./routes";

import {
  configureApp,
  connectToDatabase,
  disconnectFromDatabase,
  errorHandler,
  getBackendUrl,
  loadConfig,
  logger,
} from "./lib";

import { configureJwtStrategy } from "./controllers";
import { createSocketServer } from "./lib/sockets";
import { HTTP_STATUS } from "./lib/constants";
import { initializeI18n } from "./middleware/i18n";

// -------------------------
// Load Environment Variables and App Config
// -------------------------

dotenv.config();

// -------------------------
// Application Entry Point
// -------------------------

/**
 * Initializes and starts the Express + Socket.IO server.
 * Connects to database, sets up authentication and middleware,
 * mounts routes, and starts listening for requests.
 */
async function initializeApp(): Promise<void> {
  await initializeI18n();
  logger.info("Initializing application...");
  dotenv.config();
  const config = loadConfig();
  const backendUrl = getBackendUrl();
  const PORT = config.backendPort!;
  logger.info("Environment variables loaded successfully");

  try {
    logger.info("Connecting to MongoDB...");
    await connectToDatabase();
    logger.info("Connected to MongoDB");
  } catch (error) {
    logger.error("Failed to connect to MongoDB", error);
  }
  logger.info("Business logic initialized");

  await initializeBusinessLogic();

  const app = express();
  const { server } = createSocketServer(app);

  configureJwtStrategy(passport);
  configureApp(app);

  app.use("/", rootRouter);
  app.use("/auth", authRouter);
  app.use("/profile", meRouter);
  app.use("/security", securityRouter);
  app.use("/admin", adminRouter);
  app.use("/recovery", recoveryRouter);
  app.use("/docs", swaggerRoute);

  app.use((req: Request, res: Response) => {
    res.status(HTTP_STATUS.NOT_FOUND).json({ error: "Route not found" });
  });

  app.use(errorHandler);

  server.listen(PORT, () => {
    logger.info(`Server running at ${backendUrl}`);
  });

  process.on("SIGINT", async () => {
    logger.info("Shutting down gracefully...");
    await disconnectFromDatabase();
    server.close(() => {
      logger.info("HTTP server closed");
      process.exit(0);
    });
  });
}

// -------------------------
// Custom Application Startup Logic
// -------------------------

/**
 * Placeholder for custom startup logic such as:
 * - Seeding initial data
 * - Preloading cache
 * - Validating system state
 */
async function initializeBusinessLogic() {
  logger.info("Running custom app initialization logic...");
  // Example: await seedDatabase(); or check system health

  // Setting up emails
}

// -------------------------
// Start the App
// -------------------------

initializeApp();

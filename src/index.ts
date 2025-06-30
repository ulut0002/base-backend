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

// -------------------------
// Load Environment Variables and App Config
// -------------------------

dotenv.config();
const config = loadConfig();
const backendUrl = getBackendUrl();
const PORT = config.backendPort!;

// -------------------------
// Application Entry Point
// -------------------------

/**
 * Initializes and starts the Express + Socket.IO server.
 * Connects to database, sets up authentication and middleware,
 * mounts routes, and starts listening for requests.
 */
function initializeApp(): void {
  connectToDatabase()
    .then(() => {
      logger.info("Connected to MongoDB");
      return initializeBusinessLogic();
    })
    .catch((err) => {
      logger.error("Failed to connect to MongoDB", err);
      throw err;
    })

    .then(() => {
      logger.info("Business logic initialized");

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
        logger.info("🔌 Shutting down gracefully...");
        await disconnectFromDatabase();
        server.close(() => {
          logger.info("HTTP server closed");
          process.exit(0);
        });
      });
    })
    .catch((err) => {
      logger.error("Failed during app setup or server start", err);
      process.exit(1);
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

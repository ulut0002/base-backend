import express, { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";

import "./jobs/scheduler";

import {
  adminRouter,
  authRouter,
  meRouter,
  recoveryRouter,
  rootRouter,
  securityRouter,
  swaggerRoute,
} from "./routes";
import { configureJwtStrategy } from "./controllers";
import passport from "passport";
import {
  configureApp,
  connectToDatabase,
  disconnectFromDatabase,
  getBackendUrl,
  loadConfig,
  logger,
} from "./lib";
import { createSocketServer } from "./lib/sockets";

// -------------------------
// Load Environment Variables and Config
// -------------------------

dotenv.config();
const config = loadConfig();
const backendUrl = getBackendUrl();
const PORT = config.BACKEND_PORT || process.env.PORT || 3000;

// -------------------------
// Initialize Express and Socket.IO
// -------------------------

const app = express();
const { server } = createSocketServer(app); // Creates HTTP server and binds Socket.IO

// -------------------------
// Configure Authentication (Passport)
// -------------------------

configureJwtStrategy(passport); // JWT strategy setup for protected routes

// -------------------------
// Connect to MongoDB
// -------------------------

connectToDatabase(); // Establishes connection using Mongoose

// -------------------------
// Middleware Setup
// -------------------------

configureApp(app); // Applies body parsing, CORS, helmet, rate limiting, etc.

// -------------------------
// Route Handlers
// -------------------------

app.use("/", rootRouter); // Public landing or status endpoint
app.use("/auth", authRouter); // Login, register, logout, token logic
app.use("/profile", meRouter); // User profile (JWT-protected)
app.use("/security", securityRouter); // Security settings like 2FA
app.use("/admin", adminRouter); // Admin-only operations
app.use("/recovery", recoveryRouter); // Password recovery and reset flows
app.use("/docs", swaggerRoute);

// -------------------------
// 404 Handler for Unmatched Routes
// -------------------------

app.use((req: Request, res: Response) => {
  res.status(404).json({ error: "Route not found" });
});

// -------------------------
// Global Error Handler
// -------------------------

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  logger.error(err);
  res.status(500).json({ error: "Internal server error" });
});

// -------------------------
// Start HTTP + Socket.IO Server
// -------------------------

server.listen(PORT, () => {
  logger.info(`Server running at ${backendUrl}`);
});

// -------------------------
// Graceful Shutdown Handler
// -------------------------

process.on("SIGINT", async () => {
  logger.info("Shutting down gracefully...");
  await disconnectFromDatabase();
  server.close(() => {
    logger.info("HTTP server closed");
    process.exit(0);
  });
});

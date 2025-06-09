import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import compression from "compression";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";

import { ensureBody } from "./middleware";
import {
  adminRouter,
  authRouter,
  meRouter,
  recoveryRouter,
  rootRouter,
  securityRouter,
} from "./routes";
import { configureJwtStrategy } from "./controllers";
import passport from "passport";
import { getBackendUrl, loadConfig } from "./lib";

// Load environment variables from .env file
dotenv.config();

// Load custom config and determine backend URL
const config = loadConfig();
const backendUrl = getBackendUrl();

const app = express();
const PORT = config.BACKEND_PORT || process.env.PORT || 3000;

// Setup JWT authentication strategy for Passport
configureJwtStrategy(passport);

// Middleware for parsing JSON request bodies
app.use(express.json());

// Enable CORS with credentials for frontend communication
app.use(
  cors({
    origin: backendUrl,
    credentials: true,
  })
);

// Compress HTTP responses to improve performance
app.use(compression());

// Parse cookies attached to incoming requests
app.use(cookieParser());

// Additional body parsing middleware (for safety)
app.use(bodyParser.json());

// Initialize Passport (JWT auth middleware)
app.use(passport.initialize());

// Ensure req.body is never undefined
app.use(ensureBody);

// Connect to MongoDB
if (config.BACKEND_MONGODB_URI) {
  mongoose.Promise = Promise;
  mongoose.connect(config.BACKEND_MONGODB_URI);

  mongoose.connection.on("error", (err: Error) => {
    console.error("MongoDB connection error:", err);
  });

  mongoose.connection.on("connected", () => {
    console.info("MongoDB connected");
  });
} else {
  console.error("MongoDB URI is not defined in environment variables.");
}

// Start the Express server
app.listen(PORT, () => {
  console.log(`Server running at ${backendUrl}`);
});

// -------------------------
// Register API route groups
// -------------------------

app.use("/", rootRouter); // Public API info and health checks
app.use("/auth", authRouter); // Authentication (login, register, etc.)
app.use("/profile", meRouter); // Authenticated user's account/profile
app.use("/security", securityRouter); // Security features (2FA, sessions, etc.)
app.use("/admin", adminRouter); // Admin-only user management routes
app.use("/recovery", recoveryRouter); // Password and email recovery routes

import express, { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import compression from "compression";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import helmet from "helmet";
import multer from "multer";
import morgan from "morgan";
import configPackage from "config";
import { Server } from "socket.io";
import http from "http";
import "./jobs/scheduler";

import {
  ensureBody,
  generalLimiter,
  i18nMiddleware,
  swaggerRouter,
} from "./middleware";
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
import { getBackendUrl, loadConfig, logger } from "./lib";

// Load environment variables
dotenv.config();
const config = loadConfig();
const backendUrl = getBackendUrl();
const PORT = config.BACKEND_PORT || process.env.PORT || 3000;

const app = express();
const server = http.createServer(app); // needed for socket.io
const io = new Server(server, {
  cors: {
    origin: backendUrl,
    credentials: true,
  },
});

// Configure Passport
configureJwtStrategy(passport);

// Connect to MongoDB
if (config.BACKEND_MONGODB_URI) {
  mongoose.Promise = Promise;
  mongoose.connect(config.BACKEND_MONGODB_URI);

  mongoose.connection.on("error", (err: Error) => {
    logger.error("MongoDB connection error:", err);
  });

  mongoose.connection.on("connected", () => {
    logger.info("MongoDB connected");
  });
} else {
  logger.error("MongoDB URI is not defined in environment variables.");
}

// -------------------------
// Middleware Setup
// -------------------------

// Logging HTTP requests
app.use(morgan("dev"));

// Apply security headers
app.use(helmet());

// Rate limiter
app.use(generalLimiter);

// Enable CORS
app.use(
  cors({
    origin: backendUrl,
    credentials: true,
  })
);

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.json());
app.use(passport.initialize());
app.use(ensureBody);

// Multer setup (example, use as needed)
const upload = multer({ dest: "uploads/" });

app.use(i18nMiddleware);

app.use("/docs", swaggerRouter);

// -------------------------
// Routes
// -------------------------
app.use("/", rootRouter);
app.use("/auth", authRouter);
app.use("/profile", meRouter);
app.use("/security", securityRouter);
app.use("/admin", adminRouter);
app.use("/recovery", recoveryRouter);

// -------------------------
// Socket.IO Example
// -------------------------
io.on("connection", (socket) => {
  logger.info("A user connected:", socket.id);

  socket.on("disconnect", () => {
    logger.info("User disconnected:", socket.id);
  });
});

app.use((req: Request, res: Response) => {
  res.status(404).json({ error: "Route not found" });
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  logger.error(err);
  res.status(500).json({ error: "Internal server error" });
});

// -------------------------
// Start Server
// -------------------------
server.listen(PORT, () => {
  logger.info(`Server running at ${backendUrl}`);
});

process.on("SIGINT", async () => {
  logger.info("Shutting down gracefully...");
  await mongoose.disconnect();
  server.close(() => {
    logger.info("HTTP server closed");
    process.exit(0);
  });
});

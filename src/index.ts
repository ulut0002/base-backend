import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import compression from "compression";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import csurf from "csurf";
import multer from "multer";
import morgan from "morgan";
import winston from "winston";
import configPackage from "config";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import i18next from "i18next";
import i18nextMiddleware from "i18next-express-middleware";
import Backend from "i18next-fs-backend";
import cron from "node-cron";
import { Server } from "socket.io";
import http from "http";

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

// Setup Winston logger
const logger = winston.createLogger({
  transports: [new winston.transports.Console()],
});

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
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  })
);

// CSRF protection (enable only for state-changing routes)
app.use(csurf({ cookie: true }));

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

// -------------------------
// i18n Middleware
// -------------------------
i18next
  .use(Backend)
  .use(i18nextMiddleware.LanguageDetector)
  .init({
    fallbackLng: "en",
    preload: ["en", "tr"], // preload your supported languages
    backend: {
      loadPath: __dirname + "/locales/{{lng}}/translation.json",
    },
  });
app.use(i18nextMiddleware.handle(i18next));

// -------------------------
// Swagger Documentation
// -------------------------
const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Your API",
      version: "1.0.0",
    },
  },
  apis: ["./routes/*.ts"],
});
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

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
// Background Job Example
// -------------------------
cron.schedule("0 0 * * *", () => {
  logger.info("Daily scheduled task running.");
});

// -------------------------
// Socket.IO Example
// -------------------------
io.on("connection", (socket) => {
  logger.info("A user connected:", socket.id);

  socket.on("disconnect", () => {
    logger.info("User disconnected:", socket.id);
  });
});

// -------------------------
// Start Server
// -------------------------
server.listen(PORT, () => {
  logger.info(`Server running at ${backendUrl}`);
});

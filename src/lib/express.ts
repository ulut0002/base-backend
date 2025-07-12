import express from "express";
import cors from "cors";
import compression from "compression";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import helmet from "helmet";
import morgan from "morgan";
import passport from "passport";
import multer from "multer";
import { ensureBody, generalLimiter, i18nMiddleware } from "../middleware";
import { getBackendUrl } from "../lib";
import { loadLocale } from "../i18n/i18n-util.sync";

/**
 * Applies global middleware configuration to the Express app.
 * Includes security, logging, parsing, localization, rate limiting, and documentation routes.
 */
const configureApp = (app: express.Express) => {
  const backendUrl = getBackendUrl();

  // -------------------------
  // Logging & Security
  // -------------------------

  app.use(morgan("dev")); // Logs HTTP requests to the console
  app.use(helmet()); // Sets various HTTP headers for security

  // -------------------------
  // Rate Limiting
  // -------------------------

  app.use(generalLimiter); // Applies rate limiting to prevent abuse

  // -------------------------
  // CORS Configuration
  // -------------------------

  app.use(
    cors({
      origin: backendUrl, // Allow requests from backend URL
      credentials: true, // Allow cookies to be sent across origins
    })
  );

  // -------------------------
  // Parsers & Compression
  // -------------------------

  app.use(compression()); // Enables gzip compression for responses
  app.use(cookieParser()); // Parses cookies from incoming requests
  app.use(bodyParser.json()); // Parses JSON bodies

  // // -------------------------
  // // Internationalization
  // // -------------------------
  // app.use(i18nMiddleware);

  // -------------------------
  // Authentication
  // -------------------------

  app.use(passport.initialize()); // Initializes Passport (JWT, OAuth strategies)

  // -------------------------
  // Custom Middleware
  // -------------------------

  app.use(ensureBody); // Ensures body is not empty for applicable routes

  // -------------------------
  // File Uploads (Optional)
  // -------------------------

  const upload = multer({ dest: "uploads/" }); // Placeholder for handling file uploads
  // -------------------------
  // API Documentation
  // -------------------------
};

export { configureApp };

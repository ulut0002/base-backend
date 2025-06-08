import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import compression from "compression";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";

import { ensureBody } from "./middleware";
import { authRouter, rootRouter } from "./routes";
import { configureJwtStrategy } from "./controllers";
import passport from "passport";
import { getBackendUrl, loadConfig } from "./lib";

dotenv.config();
const config = loadConfig();
const backendUrl = getBackendUrl();

const app = express();
const PORT = config.BACKEND_PORT || process.env.PORT || 3000;

// Configure JWT strategy for passport (reads JWT from cookies)
configureJwtStrategy(passport);

app.use(express.json());

// Enable CORS for cross-origin requests (e.g., from Next.js frontend)
app.use(
  cors({
    origin: backendUrl, // expected frontend origin
    credentials: true, // allows cookies to be sent with requests
  })
);

// Use compression to gzip HTTP responses for better performance
app.use(compression());

// Parse cookies from incoming requests
app.use(cookieParser());

// Parse JSON bodies (redundant with express.json, but kept for safety)
app.use(bodyParser.json());

// Initialize Passport middleware (needed before protected routes)
app.use(passport.initialize());

// Ensure `req.body` is always defined (avoids null reference errors)
app.use(ensureBody);

// Setup MongoDB connection
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

app.listen(PORT, () => {
  console.log(`Server running at ${backendUrl}`);
});

// Define API routes
app.use("/", rootRouter); // e.g., GET / → API info
app.use("/auth", authRouter); // e.g., POST /auth/login, /auth/register

import rateLimit from "express-rate-limit";

// Time constants for readability
export const SECOND = 1000;
export const MINUTE = 60 * SECOND;
export const HOUR = 60 * MINUTE;

export const generalLimiter = rateLimit({
  windowMs: 15 * MINUTE,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

export const loginLimiter = rateLimit({
  windowMs: 5 * MINUTE,
  max: 10,
  message: "Too many login attempts. Try again in 5 minutes.",
  standardHeaders: true,
  legacyHeaders: false,
});

export const apiLimiter = rateLimit({
  windowMs: 1 * MINUTE,
  max: 20,
  message: "Too many requests from this IP. Try again soon.",
});

// src/routes/auth.ts

import express, { Router } from "express";
import passport from "passport";
import {
  login,
  logout,
  me,
  register,
  changePassword,
  checkAuthStatus,
  refreshToken,
} from "../controllers";
import { checkRole } from "../middleware";
import { UserRole } from "../types";

const authRouter: Router = express.Router();

/**
 * @route   POST /auth/login
 * @desc    Logs in a user and issues a JWT as an HttpOnly cookie.
 * @access  Public
 */
authRouter.post("/login", login);

/**
 * @route   POST /auth/register
 * @desc    Creates a new user account and issues a JWT as an HttpOnly cookie.
 * @access  Public
 */
authRouter.post("/register", register);

/**
 * @route   GET /auth/me
 * @desc    Returns the authenticated user's public profile.
 * @access  Protected - requires a valid JWT in the cookie.
 */
authRouter.get("/me", passport.authenticate("jwt", { session: false }), me);

/**
 * @route   POST /auth/logout
 * @desc    Logs the user out by clearing the JWT cookie.
 * @access  Optional protection — works even if the user is already logged out.
 */
authRouter.post("/logout", logout);

/**
 * @route   POST /auth/change-password
 * @desc    Allows a logged-in user to change their password.
 * @access  Protected
 */
authRouter.post(
  "/change-password",
  passport.authenticate("jwt", { session: false }),
  changePassword
);

/**
 * @route   POST /auth/refresh-token
 * @desc    Issues a new access token using the refresh token.
 * @access  Public
 */
authRouter.post("/refresh-token", refreshToken);

/**
 * @route   GET /auth/status
 * @desc    Returns authentication status of the current session.
 * @access  Protected
 */
authRouter.get(
  "/status",
  passport.authenticate("jwt", { session: false }),
  checkAuthStatus
);

export { authRouter };
